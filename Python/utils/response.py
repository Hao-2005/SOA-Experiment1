from typing import Any, Dict


def build_response(message: str, data: Any = None, code: int = 200) -> Dict[str, Any]:
    """Build standardized API response object.

    The format follows the README specification:
    {
        "code": 200,
        "message": "操作成功",
        "data": {...}
    }
    """
    return {"code": code, "message": message, "data": data}

