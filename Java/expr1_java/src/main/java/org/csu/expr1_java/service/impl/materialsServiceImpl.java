package org.csu.expr1_java.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.csu.expr1_java.entity.materials;
import org.csu.expr1_java.service.materialsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Materials service implementation
 * Uses WebClient to call Node.js service API (http://localhost:8082)
 * As per architecture diagram: Material Service (WebClient → Node)
 */
@Service
public class materialsServiceImpl implements materialsService {

    private static final Logger logger = LoggerFactory.getLogger(materialsServiceImpl.class);

    @Autowired
    private WebClient webClient;

    @Value("${nodejs.service.url:http://localhost:8082}")
    private String nodejsServiceUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Build base URL for Node.js service
     */
    private String getBaseUrl() {
        return nodejsServiceUrl + "/materials";
    }

    /**
     * Handle response from Node.js service
     */
    private Map<String, Object> handleResponse(Map<String, Object> responseBody) {
        if (responseBody != null) {
            return responseBody;
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "Node.js service returned empty response");
            errorResponse.put("data", null);
            return errorResponse;
        }
    }

    /**
     * Handle exception from WebClient
     */
    private Map<String, Object> handleException(Exception e, String operation) {
        logger.error("Error calling Node.js service for {}: {}", operation, e.getMessage(), e);
        Map<String, Object> errorResponse = new HashMap<>();
        
        if (e instanceof WebClientResponseException) {
            WebClientResponseException webClientEx = (WebClientResponseException) e;
            errorResponse.put("code", webClientEx.getStatusCode().value());
            errorResponse.put("message", "Node.js service error: " + webClientEx.getMessage());
        } else {
            errorResponse.put("code", 500);
            errorResponse.put("message", "无法连接到 Node.js 服务: " + e.getMessage());
        }
        errorResponse.put("data", null);
        return errorResponse;
    }

    @Override
    public Map<String, Object> getAllMaterials(Integer page, Integer pageSize, String category, String status) {
        try {
            String url = getBaseUrl();
            logger.info("Calling Node.js service via WebClient: GET {} with params: page={}, pageSize={}, category={}, status={}", 
                    url, page, pageSize, category, status);
            
            // Build URI with query parameters using WebClient's uriBuilder
            var uriSpec = webClient.get().uri(uriBuilder -> {
                uriBuilder.path(url);
                if (page != null && page > 0) {
                    uriBuilder.queryParam("page", page);
                }
                if (pageSize != null && pageSize > 0) {
                    uriBuilder.queryParam("pageSize", pageSize);
                }
                if (category != null && !category.trim().isEmpty()) {
                    uriBuilder.queryParam("category", category);
                }
                if (status != null && !status.trim().isEmpty()) {
                    uriBuilder.queryParam("status", status);
                }
                return uriBuilder.build();
            });
            
            Map<String, Object> response = uriSpec
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "getAllMaterials");
        }
    }

    @Override
    public Map<String, Object> getAvailableMaterials() {
        try {
            String url = getBaseUrl() + "/available";
            logger.info("Calling Node.js service via WebClient: GET {}", url);
            
            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "getAvailableMaterials");
        }
    }

    @Override
    public Map<String, Object> getMaterialById(Long id) {
        try {
            String url = getBaseUrl() + "/" + id;
            logger.info("Calling Node.js service via WebClient: GET {}", url);
            
            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "getMaterialById");
        }
    }

    @Override
    public Map<String, Object> createMaterial(materials material) {
        try {
            String url = getBaseUrl();
            logger.info("Calling Node.js service via WebClient: POST {}", url);
            
            // Convert materials entity to Map for JSON serialization
            Map<String, Object> requestBody = convertMaterialToMap(material);
            
            Map<String, Object> response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "createMaterial");
        }
    }

    @Override
    public Map<String, Object> updateMaterial(Long id, materials material) {
        try {
            String url = getBaseUrl() + "/" + id;
            logger.info("Calling Node.js service via WebClient: PUT {}", url);
            
            // Convert materials entity to Map for JSON serialization
            Map<String, Object> requestBody = convertMaterialToMap(material);
            
            Map<String, Object> response = webClient.put()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "updateMaterial");
        }
    }

    @Override
    public Map<String, Object> deleteMaterial(Long id) {
        try {
            String url = getBaseUrl() + "/" + id;
            logger.info("Calling Node.js service via WebClient: DELETE {}", url);
            
            Map<String, Object> response = webClient.delete()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "deleteMaterial");
        }
    }

    @Override
    public Map<String, Object> updateMaterialQuantity(Long id, String operation, Integer quantity) {
        try {
            String url = getBaseUrl() + "/" + id + "/quantity";
            logger.info("Calling Node.js service via WebClient: PUT {}", url);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("operation", operation);
            requestBody.put("quantity", quantity);
            
            Map<String, Object> response = webClient.put()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
            
            return handleResponse(response);
        } catch (Exception e) {
            return handleException(e, "updateMaterialQuantity");
        }
    }

    /**
     * Convert materials entity to Map for JSON serialization
     */
    private Map<String, Object> convertMaterialToMap(materials material) {
        Map<String, Object> map = new HashMap<>();
        
        if (material.getMaterialCode() != null) {
            map.put("material_code", material.getMaterialCode());
        }
        if (material.getName() != null) {
            map.put("name", material.getName());
        }
        if (material.getCategory() != null) {
            map.put("category", material.getCategory());
        }
        if (material.getTotalQuantity() != null) {
            map.put("total_quantity", material.getTotalQuantity());
        }
        if (material.getAvailableQuantity() != null) {
            map.put("available_quantity", material.getAvailableQuantity());
        }
        if (material.getLocation() != null) {
            map.put("location", material.getLocation());
        }
        if (material.getStatus() != null) {
            map.put("status", material.getStatus());
        }
        if (material.getDescription() != null) {
            map.put("description", material.getDescription());
        }
        if (material.getPurchaseDate() != null) {
            // Convert Date to String in format YYYY-MM-DD
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
            map.put("purchase_date", sdf.format(material.getPurchaseDate()));
        }
        if (material.getUnitPrice() != null) {
            map.put("unit_price", material.getUnitPrice());
        }
        
        return map;
    }
}
