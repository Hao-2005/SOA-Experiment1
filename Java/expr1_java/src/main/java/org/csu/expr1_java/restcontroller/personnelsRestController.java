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

}
