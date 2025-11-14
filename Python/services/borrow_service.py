"""Business logic for borrows.

This layer performs type conversion, default values, and delegates to the
repository. It does not know anything about Flask or HTTP.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from Python.models.borrow_model import to_borrow_dto, to_borrow_dto_list
from Python.repositories.borrow_repository import (
    create_borrow as repo_create_borrow,
    get_all_borrows as repo_get_all_borrows,
    get_borrow_by_id as repo_get_borrow_by_id,
    update_borrow as repo_update_borrow,
)


def _now_datetime_str() -> str:
    """Return current UTC time in MySQL DATETIME string format."""
    return datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")


def generate_borrow_code() -> str:
    """Generate a borrow code like BR20231201093000."""
    return datetime.utcnow().strftime("BR%Y%m%d%H%M%S")


def get_all_borrows() -> List[Dict[str, Any]]:
    rows = repo_get_all_borrows()
    return to_borrow_dto_list(rows)


def get_borrow_by_id(borrow_id: int) -> Optional[Dict[str, Any]]:
    row = repo_get_borrow_by_id(borrow_id)
    return to_borrow_dto(row)


def create_borrow(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new borrow record from validated payload data."""
    now = _now_datetime_str()

    borrow = {
        "borrow_code": generate_borrow_code(),
        "personnel_id": payload["personnel_id"],
        "material_id": payload["material_id"],
        "quantity": int(payload["quantity"]),
        # DATETIME
        "borrow_date": now,
        # DATE, expected to be YYYY-MM-DD string
        "expected_return_date": str(payload["expected_return_date"]),
        # DATETIME or NULL
        "actual_return_date": None,
        "status": str(payload.get("status") or "borrowed"),
        "remarks": payload.get("remarks"),
        "created_at": now,
        "updated_at": now,
    }

    created = repo_create_borrow(borrow)
    return to_borrow_dto(created)  # type: ignore[arg-type]


def update_borrow(borrow_id: int, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing borrow record with validated fields.

    Returns the updated DTO or None if the record does not exist.
    """
    existing = repo_get_borrow_by_id(borrow_id)
    if existing is None:
        return None

    updates: Dict[str, Any] = {}

    if "personnel_id" in payload:
        updates["personnel_id"] = payload["personnel_id"]
    if "material_id" in payload:
        updates["material_id"] = payload["material_id"]
    if "quantity" in payload:
        updates["quantity"] = int(payload["quantity"])
    if "expected_return_date" in payload:
        updates["expected_return_date"] = str(payload["expected_return_date"])
    if "actual_return_date" in payload:
        updates["actual_return_date"] = payload["actual_return_date"]
    if "status" in payload:
        updates["status"] = str(payload["status"])
    if "remarks" in payload:
        updates["remarks"] = payload["remarks"]

    updates["updated_at"] = _now_datetime_str()

    updated = repo_update_borrow(borrow_id, updates)
    return to_borrow_dto(updated)  # type: ignore[arg-type]

