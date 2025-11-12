package org.csu.expr1_java.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;

@Data
@TableName("borrows")
public class borrows {
    @TableId(value = "id")
    private Long id;
    @TableField(value = "borrow_code")
    private String borrowCode;
    @TableField(value = "personnel_id")
    private Long personnelId;
    @TableField(value = "material_id")
    private Long materialId;
    private Integer quantity;
    @TableField(value = "borrow_date")
    private Timestamp borrowDate;
    @TableField(value = "expected_return_date")
    private Date expectedReturnDate;
    @TableField(value = "actual_return_date")
    private Timestamp actualReturnDate;
    private String status;
    private String remarks;
    @TableField(value = "created_at")
    private Timestamp createdAt;
    @TableField(value = "updated_at")
    private Timestamp updatedAt;
}
