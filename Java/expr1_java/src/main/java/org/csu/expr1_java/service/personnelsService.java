package org.csu.expr1_java.service;

import org.csu.expr1_java.entity.personnels;

import java.util.List;
import java.util.Map;

public interface personnelsService {
    Map<String, Object> queryPersonnelsByPageAndCondition(
            Integer page, Integer pageSize, String department, String role, String status);
    personnels getById(Long id);

    boolean deleteById(Long id);
    Map<String, Object> searchPersonnels(String keyword, Integer page, Integer pageSize);
}
