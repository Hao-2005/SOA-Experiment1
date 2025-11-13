/**
 * Material controller - handles HTTP requests and responses
 */

const materialService = require('../services/materialService');
const materialValidator = require('../validators/materialValidator');
const { buildResponse } = require('../utils/response');

/**
 * Get available materials
 */
const getAvailableMaterials = async (req, res) => {
  try {
    const data = await materialService.getAvailableMaterials();
    res.json(buildResponse('查询成功', data));
  } catch (error) {
    console.error('Get available materials error:', error);
    res.status(500).json(buildResponse('服务器内部错误', null, 500));
  }
};

/**
 * Update an existing material
 */
const updateMaterial = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.id; // Prevent ID modification

    const errors = materialValidator.validateMaterialPayload(payload, true);
    if (errors.length > 0) {
      return res.status(400).json(buildResponse(errors.join('; '), null, 400));
    }

    const existing = await materialService.getMaterialById(req.params.id);
    if (!existing) {
      return res.status(404).json(buildResponse('物资不存在', null, 404));
    }

    // Validate quantity relationship
    const newTotal =
      payload.total_quantity !== undefined ? Number(payload.total_quantity) : existing.total_quantity;
    const newAvailable =
      payload.available_quantity !== undefined ? Number(payload.available_quantity) : existing.available_quantity;

    if (Number.isNaN(newTotal) || Number.isNaN(newAvailable)) {
      return res.status(400).json(buildResponse('数量字段必须为数字', null, 400));
    }

    if (newAvailable > newTotal) {
      return res.status(400).json(buildResponse('available_quantity 不能大于 total_quantity', null, 400));
    }

    // Check for duplicate material code if changed
    if (payload.material_code && payload.material_code !== existing.material_code) {
      if (await materialService.materialCodeExists(payload.material_code, existing.id)) {
        return res.status(409).json(buildResponse('物资编号已存在', null, 409));
      }
    }

    const updated = await materialService.updateMaterial(req.params.id, payload);
    return res.json(buildResponse('更新成功', updated));
  } catch (error) {
    console.error('Update material error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    console.error('Request body:', req.body);
    res.status(500).json(buildResponse(`服务器内部错误: ${error.message}`, null, 500));
  }
};

/**
 * Delete a material
 */
const deleteMaterial = async (req, res) => {
  try {
    const removed = await materialService.deleteMaterial(req.params.id);
    if (!removed) {
      return res.status(404).json(buildResponse('物资不存在', null, 404));
    }
    return res.json(buildResponse('删除成功', null));
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json(buildResponse('服务器内部错误', null, 500));
  }
};

/**
 * Update material quantity (borrow/return)
 */
const updateMaterialQuantity = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json(buildResponse('请求体不能为空，请提供 operation 和 quantity 字段', null, 400));
    }

    const { quantity, operation } = req.body;
    
    // Check if required fields are present
    if (operation === undefined || operation === null) {
      return res.status(400).json(buildResponse('operation 字段为必填项', null, 400));
    }
    
    if (quantity === undefined || quantity === null) {
      return res.status(400).json(buildResponse('quantity 字段为必填项', null, 400));
    }

    const normalizedOperation = String(operation).toLowerCase();

    const validation = materialValidator.validateQuantityOperation(normalizedOperation, quantity);
    if (!validation.valid) {
      return res.status(400).json(buildResponse(validation.error, null, 400));
    }

    const result = await materialService.updateMaterialQuantity(req.params.id, normalizedOperation, quantity);
    if (result.error) {
      const status = result.error === '物资不存在' ? 404 : 400;
      return res.status(status).json(buildResponse(result.error, null, status));
    }

    return res.json(buildResponse('物资数量更新成功', result.material));
  } catch (error) {
    console.error('Update material quantity error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    console.error('Request body:', req.body);
    console.error('Request headers:', req.headers);
    res.status(500).json(buildResponse(`服务器内部错误: ${error.message}`, null, 500));
  }
};

module.exports = {
  getAvailableMaterials,
  updateMaterial,
  deleteMaterial,
  updateMaterialQuantity
};
