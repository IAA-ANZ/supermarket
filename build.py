from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "public" / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

for filename in ("app.js", "styles.css"):
    shutil.copy2(ROOT / filename, STATIC_DIR / filename)
