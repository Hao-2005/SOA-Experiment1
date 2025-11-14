"""MySQL database access layer for the borrows service.

Configuration is read from environment variables (compatible with the Node.js
materials service), with sensible defaults for local development.
"""

import os
from contextlib import contextmanager
from typing import Any, Dict, Iterable, List, Optional, Tuple

import pymysql


DB_CONFIG: Dict[str, Any] = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    # Keep default password consistent with Node.js service; override via env.
    "password": os.getenv("DB_PASSWORD", ";0s9HFdr7-vf"),
    "database": os.getenv("DB_NAME", "soa_experiment1"),
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
    "autocommit": True,
}


@contextmanager
def get_connection():
    """Context manager that yields a new database connection.

    For simplicity we open a connection per operation; MySQL will pool
    connections on the server side. This keeps the client code small and clear.
    """
    conn = pymysql.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()


def query_all(sql: str, params: Optional[Iterable[Any]] = None) -> List[Dict[str, Any]]:
    """Execute a SELECT that returns multiple rows."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, tuple(params or ()))
            return list(cursor.fetchall())


def query_one(sql: str, params: Optional[Iterable[Any]] = None) -> Optional[Dict[str, Any]]:
    """Execute a SELECT that returns a single row (or None)."""
    rows = query_all(sql, params)
    return rows[0] if rows else None


def execute(sql: str, params: Optional[Iterable[Any]] = None) -> int:
    """Execute an INSERT statement and return the last inserted ID."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, tuple(params or ()))
            return int(cursor.lastrowid or 0)


def execute_rowcount(sql: str, params: Optional[Iterable[Any]] = None) -> int:
    """Execute an UPDATE/DELETE statement and return the affected row count."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            affected = cursor.execute(sql, tuple(params or ()))
            return int(affected)


def test_connection() -> bool:
    """Lightweight connectivity test used by the health check endpoint."""
    try:
        _ = query_one("SELECT 1")
        return True
    except Exception:
        return False

