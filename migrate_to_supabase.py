from getpass import getpass
import mimetypes
import os
from pathlib import Path
import re
import sqlite3


root = Path(__file__).resolve().parent
supabase_url = input("Supabase project URL: ").strip().rstrip("/")
service_role_key = getpass("Supabase service-role key: ").strip()
database_url = getpass("Supabase transaction-pooler DATABASE_URL: ").strip()
if not all((supabase_url, service_role_key, database_url)):
    raise SystemExit("All Supabase values are required; no data was migrated.")

os.environ["SUPABASE_URL"] = supabase_url
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = service_role_key
os.environ["DATABASE_URL"] = database_url
os.environ["SUPABASE_STORAGE_BUCKET"] = "product-images"

import server


server.initialize_db()
local_path = root / "data" / "store.sqlite3"
if not local_path.exists():
    raise SystemExit(f"Local database not found: {local_path}")

source = sqlite3.connect(f"file:{local_path}?mode=ro", uri=True)
source.row_factory = sqlite3.Row
counts = {}

try:
    with server.connect_db() as target:
        for table, columns in (
            ("users", ("id", "name", "email", "phone", "password_hash", "password_salt", "created_at")),
            ("products", ("id", "name", "description", "category", "price", "stock", "image", "visible", "updated_at")),
            ("orders", ("id", "user_id", "customer_name", "customer_phone", "city", "district", "street", "house", "note", "latitude", "longitude", "items_json", "total", "status", "created_at")),
            ("settings", ("key", "value")),
        ):
            rows = source.execute(f"SELECT {', '.join(columns)} FROM {table}").fetchall()
            counts[table] = len(rows)
            placeholders = ", ".join("?" for _ in columns)
            updates = ", ".join(f"{column}=excluded.{column}" for column in columns if column not in {"id", "key"})
            conflict_key = "key" if table == "settings" else "id"
            update_clause = f"DO UPDATE SET {updates}" if updates else "DO NOTHING"
            sql = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) ON CONFLICT({conflict_key}) {update_clause}"

            for row in rows:
                values = [row[column] for column in columns]
                if table == "products" and row["image"].startswith("/uploads/"):
                    image_name = Path(row["image"]).name
                    if not re.fullmatch(r"[a-f0-9]{32}\.(jpg|png|webp)", image_name):
                        raise ValueError("A local product image has an invalid path; no migration was completed.")
                    image_bytes = (root / "data" / "uploads" / image_name).read_bytes()
                    mime = mimetypes.guess_type(image_name)[0] or "application/octet-stream"
                    values[columns.index("image")] = server.store_product_image(image_name, image_bytes, mime)
                target.execute(sql, values)

        for table in ("users", "products"):
            target.execute(
                f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE(MAX(id), 1), COUNT(*) > 0) FROM {table}"
            )
finally:
    source.close()

print("Migration complete:")
for table, count in counts.items():
    print(f"{table}: {count} records")
print("Existing login sessions were not copied; customers and admin must sign in again on the new domain.")
