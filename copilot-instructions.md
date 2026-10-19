# Project Instructions

- This project is a dependency-free Python 3 grocery store with a browser client and SQLite persistence.
- Keep customer authentication, product and order operations, uploads, and AI provider credentials on the server. Never commit secrets.
- Customer pages are `/auth` and `/`; the separate store administration page is `/admin`.
- Preserve Arabic RTL and English LTR support, responsive layouts, and keyboard-friendly numeric entry.
- Products, settings, sessions, and orders belong in the server database; user-uploaded product images belong in persistent storage.
- Validate changes with `python3 -m py_compile server.py`, workspace diagnostics, and focused browser/API checks.

## Setup Checklist

- [x] Confirmed this project uses Python because Node.js is unavailable in the workspace environment.
- [x] Scaffolded the Python server, browser UI, database, and documentation.
- [x] Implemented storefront, authentication, admin tools, checkout, and shopping assistant.
- [x] No VS Code extensions or external packages are required.
- [x] Python syntax, workspace diagnostics, API flows, and desktop/mobile layouts were checked.
- [x] Documented local startup, environment configuration, persistence, and deployment caveats in README.md.
- [ ] Configure a unique `STORE_ADMIN_PASSWORD` and optional `AI_API_KEY` in the deployment environment before public launch.
