package org.csu.expr1_java.service;

import org.csu.expr1_java.entity.materials;

import java.util.Map;

/**
 * Materials service interface
 * Gateway service that calls Node.js API
 */
public interface materialsService {
    
    /**
     * Get available materials
     * @return Map containing response from Node.js service
     */
    Map<String, Object> getAvailableMaterials();
    
    /**
     * Get material by ID
     * @param id Material ID
     * @return Map containing response from Node.js service
     */
    Map<String, Object> getMaterialById(Long id);
    
    /**
     * Create a new material
     * @param material Material entity
     * @return Map containing response from Node.js service
     */
    Map<String, Object> createMaterial(materials material);
    
    /**
     * Update material information
     * @param id Material ID
     * @param material Updated material data
     * @return Map containing response from Node.js service
     */
    Map<String, Object> updateMaterial(Long id, materials material);
    
    /**
     * Delete material
     * @param id Material ID
     * @return Map containing response from Node.js service
     */
    Map<String, Object> deleteMaterial(Long id);
    
    /**
     * Update material quantity (borrow/return)
     * @param id Material ID
     * @param operation Operation type: "borrow" or "return"
     * @param quantity Quantity to borrow/return
     * @return Map containing response from Node.js service
     */
    Map<String, Object> updateMaterialQuantity(Long id, String operation, Integer quantity);
}

