"""Low-level database operations for the borrows table.

This layer knows SQL and table structure but nothing about HTTP or Flask.
"""

from typing import Any, Dict, List, Optional

from Python.config.db import execute, execute_rowcount, query_all, query_one


def get_all_borrows() -> List[Dict[str, Any]]:
    sql = "SELECT * FROM borrows ORDER BY id ASC"
    return query_all(sql)


def get_borrow_by_id(borrow_id: int) -> Optional[Dict[str, Any]]:
    sql = "SELECT * FROM borrows WHERE id = %s"
    return query_one(sql, (borrow_id,))


def create_borrow(borrow: Dict[str, Any]) -> Dict[str, Any]:
    """Insert a new borrow record and return the freshly loaded row."""
    sql = """
        INSERT INTO borrows (
            borrow_code,
            personnel_id,
            material_id,
            quantity,
            borrow_date,
            expected_return_date,
            actual_return_date,
            status,
            remarks,
            created_at,
            updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        borrow["borrow_code"],
        borrow["personnel_id"],
        borrow["material_id"],
        borrow["quantity"],
        borrow["borrow_date"],
        borrow["expected_return_date"],
        borrow.get("actual_return_date"),
        borrow["status"],
        borrow.get("remarks"),
        borrow["created_at"],
        borrow["updated_at"],
    )
    new_id = execute(sql, params)
    return get_borrow_by_id(new_id)


def update_borrow(borrow_id: int, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Update an existing borrow record and return the updated row.

    If no fields are provided, the original row (if any) is returned.
    If the record does not exist, returns None.
    """
    if not updates:
        return get_borrow_by_id(borrow_id)

    fields = []
    values = []

    for key, value in updates.items():
        if key == "id":
            continue
        fields.append(f"{key} = %s")
        values.append(value)

    if not fields:
        return get_borrow_by_id(borrow_id)

    values.append(borrow_id)
    sql = f"UPDATE borrows SET {', '.join(fields)} WHERE id = %s"
    affected = execute_rowcount(sql, tuple(values))
    if affected == 0:
        return None
    return get_borrow_by_id(borrow_id)

