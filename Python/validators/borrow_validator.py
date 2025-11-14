"""Validation helpers for borrow request payloads."""

from datetime import date
from typing import Any, Dict, List


VALID_STATUS = {"borrowed", "returned", "overdue"}


def _is_positive_int(value: Any) -> bool:
    try:
        return int(value) > 0
    except (TypeError, ValueError):
        return False


def validate_borrow_payload(payload: Dict[str, Any], partial: bool = False) -> List[str]:
    """Validate borrow payload.

    :param payload: JSON body as dict
    :param partial: True for PATCH/PUT (partial update), False for create
    :return: list of error messages (empty means valid)
    """
    errors: List[str] = []

    required_fields = ["personnel_id", "material_id", "quantity", "expected_return_date"]
    if not partial:
        for field in required_fields:
            if field not in payload:
                errors.append(f"{field} 为必填字段")

    if "quantity" in payload and not _is_positive_int(payload.get("quantity")):
        errors.append("quantity 必须为正整数")

    if "expected_return_date" in payload:
        try:
            date.fromisoformat(str(payload["expected_return_date"]))
        except ValueError:
            errors.append("expected_return_date 必须为 YYYY-MM-DD 格式")

    if "status" in payload and payload["status"] not in VALID_STATUS:
        errors.append("status 必须是 borrowed/returned/overdue 之一")

    return errors

