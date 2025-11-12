package org.csu.expr1_java.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

@Data
@TableName("materials")
public class materials {
    @TableId(value = "id")
    private Long id;
    @TableField(value = "material_code")
    private String materialCode;
    private String name;
    private String category;
    private Integer totalQuantity;
    private Integer availableQuantity;
    private String location;
    private String status;
    private String description;
    private Date purchaseDate;
    private BigDecimal unitPrice;
    @TableField(value = "created_at")
    private Timestamp createdAt;
    @TableField(value = "updated_at")
    private Timestamp updatedAt;
}
