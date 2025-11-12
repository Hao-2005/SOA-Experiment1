package org.csu.expr1_java.persistence;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.csu.expr1_java.entity.personnels;
import org.springframework.stereotype.Repository;

@Repository
public interface personnelsMapper extends BaseMapper<personnels> {
}
