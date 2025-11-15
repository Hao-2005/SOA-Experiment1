package org.csu.expr1_java.restcontroller;

import org.csu.expr1_java.entity.materials;
import org.csu.expr1_java.service.materialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Materials REST Controller (Gateway)
 * Routes requests to Node.js service
 * 
 * Call chain: Controller -> Service -> Node.js API -> Database
 */
@RestController
@RequestMapping("/api/materials")
public class materialsRestController {

    @Autowired
    private materialsService materialsService;

    /**
     * Get all materials with optional pagination and filtering
     * GET /api/materials
     * - Without page/pageSize: returns all materials as array
     * - With page/pageSize: returns paginated result with materials array and pagination info
     */
    @GetMapping
    public Map<String, Object> getAllMaterials(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return materialsService.getAllMaterials(page, pageSize, category, status);
    }

    /**
     * Get available materials
     * GET /api/materials/available
     */
    @GetMapping("/available")
    public Map<String, Object> getAvailableMaterials() {
        return materialsService.getAvailableMaterials();
    }

    /**
     * Get material by ID
     * GET /api/materials/{id}
     */
    @GetMapping("/{id}")
    public Map<String, Object> getMaterialById(@PathVariable Long id) {
        return materialsService.getMaterialById(id);
    }

    /**
     * Create a new material
     * POST /api/materials
     */
    @PostMapping
    public Map<String, Object> createMaterial(@RequestBody materials material) {
        System.out.println(material);
        return materialsService.createMaterial(material);
    }

    /**
     * Update material information
     * PUT /api/materials/{id}
     */
    @PutMapping("/{id}")
    public Map<String, Object> updateMaterial(@PathVariable Long id, @RequestBody materials material) {
        return materialsService.updateMaterial(id, material);
    }

    /**
     * Delete material
     * DELETE /api/materials/{id}
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteMaterial(@PathVariable Long id) {
        return materialsService.deleteMaterial(id);
    }

    /**
     * Update material quantity (borrow/return)
     * PUT /api/materials/{id}/quantity
     */
    @PutMapping("/{id}/quantity")
    public Map<String, Object> updateMaterialQuantity(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        System.out.println(request);
        String operation = (String) request.get("operation");
        Integer quantity = null;
        
        // Handle both Integer and String quantity
        Object qtyObj = request.get("quantity");
        if (qtyObj instanceof Integer) {
            quantity = (Integer) qtyObj;
        } else if (qtyObj instanceof String) {
            quantity = Integer.parseInt((String) qtyObj);
        } else if (qtyObj instanceof Number) {
            quantity = ((Number) qtyObj).intValue();
        }
        return materialsService.updateMaterialQuantity(id, operation, quantity);
    }
}

