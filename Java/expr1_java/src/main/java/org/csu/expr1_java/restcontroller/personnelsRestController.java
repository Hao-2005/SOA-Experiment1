package org.csu.expr1_java.restcontroller;

import org.csu.expr1_java.entity.personnels;
import org.csu.expr1_java.service.personnelsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.Map;

@RestController
@Controller
@RequestMapping("/api/personnels")
public class personnelsRestController {

    @Autowired
    private personnelsService personnelsService;


    @GetMapping
    public Map<String, Object> getPersonnels(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status
    ) {
        Map<String, Object> result = personnelsService.queryPersonnelsByPageAndCondition(page, pageSize, department, role, status);

        // 从 result 中提取分页信息
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", result.get("page"));
        pagination.put("page_size", result.get("page_size"));
        pagination.put("total", result.get("total"));
        pagination.put("total_pages", result.get("total_pages"));

        Map<String, Object> data = new HashMap<>();
        data.put("items", result.get("items"));
        data.put("pagination", pagination);

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "查询成功");
        response.put("data", data);

        return response;
    }


    @GetMapping("/{id}")
    public Map<String, Object> getPersonnelById(@PathVariable Long id) {
        personnels personnel = personnelsService.getById(id);
        Map<String, Object> response = new HashMap<>();
        if (personnel != null) {
            response.put("code", 200);
            response.put("message", "查询成功");
            response.put("data", personnel);
        } else {
            response.put("code", 404);
            response.put("message", "人员不存在");
            response.put("error", "Personnel with id " + id + " not found");
        }
        return response;
    }

    @PostMapping
    public Map<String, Object> createPersonnel(@RequestBody personnels personnel) {
        Map<String, Object> response = new HashMap<>();
        try {
            personnels created = personnelsService.createPersonnel(personnel);
            response.put("code", 201);
            response.put("message", "人员创建成功");
            response.put("data", created);
        } catch (Exception e) {
            response.put("code", 400);
            response.put("message", "创建失败");
            response.put("error", e.getMessage());
        }
        return response;
    }

    @PutMapping("/{id}")
    public Map<String, Object> updatePersonnel(@PathVariable Long id, @RequestBody personnels updatedData) {
        Map<String, Object> response = new HashMap<>();
        try {
            personnels updated = personnelsService.updatePersonnel(id, updatedData);
            response.put("code", 200);
            response.put("message", "人员信息更新成功");
            response.put("data", updated);
        } catch (Exception e) {
            response.put("code", 400);
            response.put("message", "更新失败");
            response.put("error", e.getMessage());
        }
        return response;
    }


    @DeleteMapping("/{id}")
    public Map<String, Object> deletePersonnel(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean success = personnelsService.deleteById(id);
            if (success) {
                response.put("code", 200);
                response.put("message", "人员删除成功");
                response.put("data", null);
            } else {
                response.put("code", 400);
                response.put("message", "删除失败");
                response.put("error", "无法删除");
            }
        } catch (Exception e) {
            response.put("code", 400);
            response.put("message", "删除失败");
            response.put("error", "无法删除");
        }
        return response;
    }

    @GetMapping("/search")
    public Map<String, Object> searchPersonnels(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize
    ) {
        Map<String, Object> result = personnelsService.searchPersonnels(keyword, page, pageSize);

        // 从 result 中提取分页信息
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("page", result.get("page"));
        pagination.put("page_size", result.get("page_size"));
        pagination.put("total", result.get("total"));
        pagination.put("total_pages", result.get("total_pages"));

        Map<String, Object> data = new HashMap<>();
        data.put("items", result.get("items"));
        data.put("pagination", pagination);

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "搜索成功");
        response.put("data", data);

        return response;
    }
}
