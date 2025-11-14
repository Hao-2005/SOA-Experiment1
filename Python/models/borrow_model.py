"""DTO helpers for borrows.

These functions convert raw database rows (Dicts with date/datetime values)
into JSON-serializable dictionaries following the README structure.
"""

from datetime import date, datetime
from typing import Any, Dict, Iterable, List, Optional


def _to_iso(value: Any) -> Any:
    """Convert date/datetime values to ISO8601 strings; leave others as-is."""
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def to_borrow_dto(row: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if row is None:
        return None

    dto: Dict[str, Any] = dict(row)
    for key in (
        "borrow_date",
        "expected_return_date",
        "actual_return_date",
        "created_at",
        "updated_at",
    ):
        if key in dto:
            dto[key] = _to_iso(dto[key])
    return dto


def to_borrow_dto_list(rows: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [to_borrow_dto(r) for r in rows]

