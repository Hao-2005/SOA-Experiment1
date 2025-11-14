import os
import sys

from flask import Flask, jsonify

# Ensure the repository root (containing the Python package) is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(CURRENT_DIR)
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from Python.config.db import test_connection
from Python.controllers.borrow_controller import borrow_bp
from Python.utils.response import build_response

app = Flask(__name__)


# Register blueprints for both internal and gateway-style paths
app.register_blueprint(borrow_bp, url_prefix="/borrows")
app.register_blueprint(borrow_bp, url_prefix="/api/borrows")


@app.get("/")
def health_check():
    """健康检查 + 数据库连通性检查"""
    db_ok = test_connection()
    code = 200 if db_ok else 500
    message = "Borrow service is running" if db_ok else "Borrow service has DB connection issue"
    data = {
        "service": "borrows",
        "db_status": "ok" if db_ok else "error",
    }
    return jsonify(build_response(message, data, code)), code


if __name__ == "__main__":
    # 默认监听 8081 端口，与 README 设计保持一致
    app.run(host="0.0.0.0", port=8081, debug=True)

