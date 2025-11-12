package org.csu.expr1_java.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.sql.Timestamp;

@Data
@TableName("personnels")
public class personnels {
    @TableId(value = "id")
    private Long id;
    @TableField(value = "employee_id")
    private String employeeId;
    @TableField(value = "name")
    private String name;
    @TableField(value = "department")
    private String department;
    @TableField(value = "role")
    private String role;
    @TableField(value = "contact")
    private String contact;
    @TableField(value = "email")
    private String email;
    @TableField(value = "status")
    private String status;
    @TableField(value = "created_at")
    private Timestamp createdAt;
    @TableField(value = "updated_at")
    private Timestamp updatedAt;

}
