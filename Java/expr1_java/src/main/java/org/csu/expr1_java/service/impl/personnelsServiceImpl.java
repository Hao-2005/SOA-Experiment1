package org.csu.expr1_java.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.csu.expr1_java.entity.personnels;
import org.csu.expr1_java.persistence.personnelsMapper;
import org.csu.expr1_java.service.personnelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("personnelsService")
public class personnelsServiceImpl implements personnelsService {

    @Autowired
    private personnelsMapper personnelMapper;

    @Override
    public Map<String, Object> queryPersonnelsByPageAndCondition(Integer page, Integer pageSize, String department, String role, String status) {
        if (page == null || page <= 0) page = 1;
        if (pageSize == null || pageSize <= 0) pageSize = 10;
        int offset = (page - 1) * pageSize;

        // 查询条件
        QueryWrapper<personnels> wrapper = new QueryWrapper<>();
        if (department != null && !department.isEmpty()) wrapper.eq("department", department);
        if (role != null && !role.isEmpty()) wrapper.eq("role", role);
        if (status != null && !status.isEmpty()) wrapper.eq("status", status);

        // 总数
        long total = personnelMapper.selectCount(wrapper);

        // 当前页数据（直接在 wrapper 上拼 LIMIT）
        List<personnels> records = personnelMapper.selectList(wrapper.last("LIMIT " + offset + ", " + pageSize));

        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("items", records);
        result.put("page", page);
        result.put("page_size", pageSize);
        result.put("total", total);
        result.put("total_pages", (long) Math.ceil((double) total / pageSize));

        return result;
    }

    @Override
    public personnels getById(Long id) {
        return personnelMapper.selectById(id);
    }

    @Override
    public boolean deleteById(Long id) {
        int rows = personnelMapper.deleteById(id);
        return rows > 0;
    }

    @Override
    public Map<String, Object> searchPersonnels(String keyword, Integer page, Integer pageSize) {
        if (page == null || page <= 0) page = 1;
        if (pageSize == null || pageSize <= 0) pageSize = 10;
        int offset = (page - 1) * pageSize;

        // 构建搜索条件：姓名、工号、部门
        QueryWrapper<personnels> wrapper = new QueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like("name", keyword)
                    .or().like("employee_id", keyword)
                    .or().like("department", keyword));
        }

        // 总数
        long total = personnelMapper.selectCount(wrapper);

        // 当前页数据
        List<personnels> records = personnelMapper.selectList(wrapper.last("LIMIT " + offset + ", " + pageSize));

        // 返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("items", records);
        result.put("page", page);
        result.put("page_size", pageSize);
        result.put("total", total);
        result.put("total_pages", (long) Math.ceil((double) total / pageSize));

        return result;
    }
}
