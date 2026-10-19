from io import BytesIO
import os

from flask import Flask, Response, request
from werkzeug.datastructures import Headers

from server import (
    DATABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_URL,
    StoreHandler,
    initialize_db,
)


if os.environ.get("VERCEL") and not all((DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)):
    raise RuntimeError("Set DATABASE_URL, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables")

initialize_db()
app = Flask(__name__)


@app.route("/", defaults={"path": ""}, methods=["GET", "POST", "PUT", "DELETE"])
@app.route("/<path:path>", methods=["GET", "POST", "PUT", "DELETE"])
def dispatch(path):
    body = request.get_data(cache=False)
    handler = StoreHandler.__new__(StoreHandler)
    handler.command = request.method
    handler.path = request.path + (f"?{request.query_string.decode('ascii')}" if request.query_string else "")
    handler.headers = request.headers
    handler.rfile = BytesIO(body)
    handler.wfile = BytesIO()
    response_status = [200]
    response_headers = Headers()

    def send_response(status, message=None):
        response_status[0] = status

    def send_header(name, value):
        response_headers.add(name, value)

    def end_headers():
        return None

    def send_error(status, message=None, explain=None):
        response_status[0] = status
        response_headers.add("Content-Type", "text/plain; charset=utf-8")
        handler.wfile.write((message or "Not Found").encode("utf-8"))

    handler.send_response = send_response
    handler.send_header = send_header
    handler.end_headers = end_headers
    handler.send_error = send_error
    getattr(handler, f"do_{request.method}")()
    return Response(handler.wfile.getvalue(), status=response_status[0], headers=response_headers)


if __name__ == "__main__":
    app.run(host=os.environ.get("HOST", "127.0.0.1"), port=int(os.environ.get("PORT", "8000")))
