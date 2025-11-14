"""HTTP layer (Flask controller) for borrow APIs.

This module only handles HTTP concerns: parsing requests and building
standardized responses. Business logic lives in services; SQL lives in
repositories.
"""

from flask import Blueprint, jsonify, request

from Python.services.borrow_service import (
    create_borrow,
    get_all_borrows,
    get_borrow_by_id,
    update_borrow,
)
from Python.utils.response import build_response
from Python.validators.borrow_validator import validate_borrow_payload


borrow_bp = Blueprint("borrows", __name__)


@borrow_bp.route("", methods=["GET"])
@borrow_bp.route("/", methods=["GET"])
def list_borrows():
    data = get_all_borrows()
    return jsonify(build_response("查询成功", data))


@borrow_bp.route("/<int:borrow_id>", methods=["GET"])
def get_borrow(borrow_id: int):
    borrow = get_borrow_by_id(borrow_id)
    if not borrow:
        return jsonify(build_response("借用记录不存在", None, 404)), 404
    return jsonify(build_response("查询成功", borrow))


@borrow_bp.route("", methods=["POST"])
@borrow_bp.route("/", methods=["POST"])
def create_borrow_endpoint():
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify(build_response("请求体必须为 JSON", None, 400)), 400

    errors = validate_borrow_payload(payload, partial=False)
    if errors:
        return jsonify(build_response("; ".join(errors), None, 400)), 400

    created = create_borrow(payload)
    return jsonify(build_response("借用记录创建成功", created)), 201


@borrow_bp.route("/<int:borrow_id>", methods=["PUT"])
def update_borrow_endpoint(borrow_id: int):
    payload = request.get_json(silent=True) or {}
    if not payload:
        return jsonify(build_response("请求体不能为空", None, 400)), 400

    errors = validate_borrow_payload(payload, partial=True)
    if errors:
        return jsonify(build_response("; ".join(errors), None, 400)), 400

    updated = update_borrow(borrow_id, payload)
    if updated is None:
        return jsonify(build_response("借用记录不存在", None, 404)), 404

    return jsonify(build_response("更新成功", updated))

