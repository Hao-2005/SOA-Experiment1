# SOA-Experiment1

## 一、系统架构概述

### 1.1 架构图
```
                    客户端 (Postman/浏览器)
                            |
                            v
                  ┌──────────────────────┐
                  │  Java Gateway (8080) │
                  │  统一REST API入口     │
                  └──────────────────────┘
                      /      |       \
                     /       |        \
                    /        |         \
         ┌─────────┐  ┌──────────┐  ┌─────────┐
         │ Python  │  │  Java    │  │ Node.js │
         │ Flask   │  │  Spring  │  │ Express │
         │ :8081   │  │  :8080   │  │ :8082   │
         │ Borrows │  │Personnel │  │Materials│
         └─────────┘  └──────────┘  └─────────┘
```

### 1.2 服务说明
- **Java Gateway (8080)**: 统一网关入口 + 人员管理服务
- **Python Flask (8081)**: 借用记录管理服务
- **Node.js Express (8082)**: 物资管理服务

---

## 二、数据表设计

### 2.1 人员管理表 (personnels)

| 字段名 | 数据类型 | 说明 | 约束 |
|--------|---------|------|------|
| id | BIGINT | 主键ID | PRIMARY KEY, AUTO_INCREMENT |
| employee_id | VARCHAR(50) | 工号/学号 | UNIQUE, NOT NULL |
| name | VARCHAR(100) | 姓名 | NOT NULL |
| department | VARCHAR(100) | 部门/院系 | NOT NULL |
| role | VARCHAR(20) | 角色(teacher/student/admin) | NOT NULL |
| contact | VARCHAR(50) | 联系方式 | |
| email | VARCHAR(100) | 邮箱 | |
| status | VARCHAR(20) | 状态(active/inactive) | DEFAULT 'active' |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

**示例数据**:
```json
{
  "id": 1,
  "employee_id": "T20210001",
  "name": "张三",
  "department": "计算机学院",
  "role": "teacher",
  "contact": "13800138000",
  "email": "zhangsan@example.com",
  "status": "active"
}
```

### 2.2 物资管理表 (materials)

| 字段名 | 数据类型 | 说明 | 约束 |
|--------|---------|------|------|
| id | BIGINT | 主键ID | PRIMARY KEY, AUTO_INCREMENT |
| material_code | VARCHAR(50) | 物资编号 | UNIQUE, NOT NULL |
| name | VARCHAR(200) | 物资名称 | NOT NULL |
| category | VARCHAR(50) | 类别(equipment/consumable/book) | NOT NULL |
| total_quantity | INT | 总数量 | NOT NULL, DEFAULT 0 |
| available_quantity | INT | 可用数量 | NOT NULL, DEFAULT 0 |
| location | VARCHAR(100) | 存放位置 | NOT NULL |
| status | VARCHAR(20) | 状态(available/maintenance/scrapped) | DEFAULT 'available' |
| description | TEXT | 描述信息 | |
| purchase_date | DATE | 采购日期 | |
| unit_price | DECIMAL(10,2) | 单价 | |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

**示例数据**:
```json
{
  "id": 1,
  "material_code": "EQ20230001",
  "name": "笔记本电脑 ThinkPad X1",
  "category": "equipment",
  "total_quantity": 10,
  "available_quantity": 7,
  "location": "实验室A501",
  "status": "available",
  "description": "用于教学实验",
  "purchase_date": "2023-09-01",
  "unit_price": 8999.00
}
```

### 2.3 借用记录表 (borrows)

| 字段名 | 数据类型 | 说明 | 约束 |
|--------|---------|------|------|
| id | BIGINT | 主键ID | PRIMARY KEY, AUTO_INCREMENT |
| borrow_code | VARCHAR(50) | 借用单号 | UNIQUE, NOT NULL |
| personnel_id | BIGINT | 借用人员ID | NOT NULL |
| material_id | BIGINT | 物资ID | NOT NULL |
| quantity | INT | 借用数量 | NOT NULL, DEFAULT 1 |
| borrow_date | DATETIME | 借用时间 | NOT NULL |
| expected_return_date | DATE | 预计归还日期 | NOT NULL |
| actual_return_date | DATETIME | 实际归还时间 | |
| status | VARCHAR(20) | 状态(borrowed/returned/overdue) | DEFAULT 'borrowed' |
| remarks | TEXT | 备注 | |
| created_at | TIMESTAMP | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

**示例数据**:
```json
{
  "id": 1,
  "borrow_code": "BR20231201001",
  "personnel_id": 1,
  "material_id": 1,
  "quantity": 1,
  "borrow_date": "2023-12-01T09:30:00",
  "expected_return_date": "2023-12-15",
  "actual_return_date": null,
  "status": "borrowed",
  "remarks": "用于课程设计"
}
```

---

## 三、各模块内部API设计

### 3.1 模块一：人员管理 (Java/Spring Boot - 8080)

#### 内部API端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /personnels | 获取所有人员列表 |
| GET | /personnels/{id} | 根据ID获取人员信息 |
| POST | /personnels | 创建新人员 |
| PUT | /personnels/{id} | 更新人员信息 |
| DELETE | /personnels/{id} | 删除人员 |
| GET | /personnels/search?keyword={keyword} | 搜索人员 |

#### 请求/响应示例

**创建人员 (POST /personnels)**
```json
// Request
{
  "employee_id": "T20210001",
  "name": "张三",
  "department": "计算机学院",
  "role": "teacher",
  "contact": "13800138000",
  "email": "zhangsan@example.com"
}

// Response (201 Created)
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "employee_id": "T20210001",
    "name": "张三",
    "department": "计算机学院",
    "role": "teacher",
    "contact": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active",
    "created_at": "2023-12-01T10:00:00"
  }
}
```

---

### 3.2 模块二：物资管理 (Node.js/Express - 8082)

#### 内部API端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /materials | 获取所有物资列表 |
| GET | /materials/{id} | 根据ID获取物资信息 |
| POST | /materials | 创建新物资 |
| PUT | /materials/{id} | 更新物资信息 |
| DELETE | /materials/{id} | 删除物资 |
| GET | /materials/available | 获取可用物资列表 |
| PUT | /materials/{id}/quantity | 更新物资数量(借出/归还) |

#### 请求/响应示例

**创建物资 (POST /materials)**
```json
// Request
{
  "material_code": "EQ20230001",
  "name": "笔记本电脑 ThinkPad X1",
  "category": "equipment",
  "total_quantity": 10,
  "available_quantity": 10,
  "location": "实验室A501",
  "description": "用于教学实验",
  "unit_price": 8999.00
}

// Response (201 Created)
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1,
    "material_code": "EQ20230001",
    "name": "笔记本电脑 ThinkPad X1",
    "category": "equipment",
    "total_quantity": 10,
    "available_quantity": 10,
    "location": "实验室A501",
    "status": "available",
    "description": "用于教学实验",
    "unit_price": 8999.00,
    "created_at": "2023-12-01T10:00:00"
  }
}
```

**更新物资数量 (PUT /materials/{id}/quantity)**
```json
// Request (借出操作)
{
  "operation": "borrow",  // borrow(借出) 或 return(归还)
  "quantity": 1
}

// Response (200 OK)
{
  "code": 200,
  "message": "物资数量更新成功",
  "data": {
    "id": 1,
    "available_quantity": 9,
    "total_quantity": 10
  }
}
```

---

### 3.3 模块三：借用记录管理 (Python/Flask - 8081)

#### 内部API端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /borrows | 获取所有借用记录 |
| GET | /borrows/{id} | 根据ID获取借用记录 |
| POST | /borrows | 创建新借用记录 |
| PUT | /borrows/{id} | 更新借用记录 |
| DELETE | /borrows/{id} | 删除借用记录 |
| PUT | /borrows/{id}/return | 归还物资 |
| GET | /borrows/personnel/{personnel_id} | 获取某人员的借用记录 |
| GET | /borrows/material/{material_id} | 获取某物资的借用记录 |
| GET | /borrows/overdue | 获取逾期未归还记录 |

#### 请求/响应示例

**创建借用记录 (POST /borrows)**
```json
// Request
{
  "personnel_id": 1,
  "material_id": 1,
  "quantity": 1,
  "expected_return_date": "2023-12-15",
  "remarks": "用于课程设计"
}

// Response (201 Created)
{
  "code": 200,
  "message": "借用记录创建成功",
  "data": {
    "id": 1,
    "borrow_code": "BR20231201001",
    "personnel_id": 1,
    "material_id": 1,
    "quantity": 1,
    "borrow_date": "2023-12-01T09:30:00",
    "expected_return_date": "2023-12-15",
    "status": "borrowed",
    "remarks": "用于课程设计",
    "created_at": "2023-12-01T09:30:00"
  }
}
```

**归还物资 (PUT /borrows/{id}/return)**
```json
// Request
{
  "remarks": "物品完好归还"
}

// Response (200 OK)
{
  "code": 200,
  "message": "归还成功",
  "data": {
    "id": 1,
    "borrow_code": "BR20231201001",
    "status": "returned",
    "actual_return_date": "2023-12-10T14:30:00"
  }
}
```

---

## 四、统一网关REST API设计

**网关基础URL**: `http://localhost:8080/api`

### 4.1 人员管理API

| 方法 | 路径 | 说明 | 转发到 |
|------|------|------|--------|
| GET | /api/personnels | 获取所有人员 | 本地服务 |
| GET | /api/personnels/{id} | 获取指定人员 | 本地服务 |
| POST | /api/personnels | 创建人员 | 本地服务 |
| PUT | /api/personnels/{id} | 更新人员 | 本地服务 |
| DELETE | /api/personnels/{id} | 删除人员 | 本地服务 |
| GET | /api/personnels/search | 搜索人员 | 本地服务 |

### 4.2 物资管理API

| 方法 | 路径 | 说明 | 转发到 |
|------|------|------|--------|
| GET | /api/materials | 获取所有物资 | Node.js:8082 |
| GET | /api/materials/{id} | 获取指定物资 | Node.js:8082 |
| POST | /api/materials | 创建物资 | Node.js:8082 |
| PUT | /api/materials/{id} | 更新物资 | Node.js:8082 |
| DELETE | /api/materials/{id} | 删除物资 | Node.js:8082 |
| GET | /api/materials/available | 获取可用物资 | Node.js:8082 |

### 4.3 借用记录管理API

| 方法 | 路径 | 说明 | 转发到 |
|------|------|------|--------|
| GET | /api/borrows | 获取所有借用记录 | Python:8081 |
| GET | /api/borrows/{id} | 获取指定借用记录 | Python:8081 |
| POST | /api/borrows | 创建借用记录 | Python:8081 |
| PUT | /api/borrows/{id} | 更新借用记录 | Python:8081 |
| DELETE | /api/borrows/{id} | 删除借用记录 | Python:8081 |
| PUT | /api/borrows/{id}/return | 归还物资 | Python:8081 |
| GET | /api/borrows/personnel/{personnel_id} | 获取人员借用记录 | Python:8081 |
| GET | /api/borrows/material/{material_id} | 获取物资借用记录 | Python:8081 |
| GET | /api/borrows/overdue | 获取逾期记录 | Python:8081 |

### 4.4 业务组合API (跨服务调用)

网关提供的高级API，需要调用多个微服务：

| 方法 | 路径 | 说明 | 涉及服务 |
|------|------|------|---------|
| POST | /api/borrows/borrow-material | 借用物资(完整流程) | Python + Node.js |
| GET | /api/borrows/{id}/detail | 获取借用详情(包含人员和物资信息) | Python + Java + Node.js |
| GET | /api/dashboard/statistics | 获取统计信息 | All services |

#### 示例：完整借用流程 API

**POST /api/borrows/borrow-material**

此API实现完整的借用流程，网关需要：
1. 调用Java服务验证人员是否存在
2. 调用Node.js服务检查物资是否可用
3. 调用Node.js服务减少物资可用数量
4. 调用Python服务创建借用记录

```json
// Request
{
  "personnel_id": 1,
  "material_id": 1,
  "quantity": 1,
  "expected_return_date": "2023-12-15",
  "remarks": "用于课程设计"
}

// Response (200 OK)
{
  "code": 200,
  "message": "借用成功",
  "data": {
    "borrow_record": {
      "id": 1,
      "borrow_code": "BR20231201001",
      "status": "borrowed"
    },
    "personnel": {
      "id": 1,
      "name": "张三",
      "employee_id": "T20210001"
    },
    "material": {
      "id": 1,
      "name": "笔记本电脑 ThinkPad X1",
      "available_quantity": 9
    }
  }
}
```

---

## 五、统一响应格式

所有API响应统一使用以下格式：

### 5.1 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": { /* 实际数据 */ }
}
```

### 5.2 错误响应
```json
{
  "code": 400,  // 或其他HTTP状态码
  "message": "错误信息描述",
  "error": "详细错误信息"
}
```

### 5.3 分页响应
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "items": [ /* 数据列表 */ ],
    "pagination": {
      "page": 1,
      "page_size": 10,
      "total": 100,
      "total_pages": 10
    }
  }
}
```

---

## 六、HTTP状态码约定

| 状态码 | 说明 | 使用场景 |
|--------|------|---------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 删除成功 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 服务不可用(微服务调用失败) |

---

## 七、服务间调用示例

### 7.1 Java网关调用Node.js服务

```java
// Java中使用RestTemplate调用Node.js服务
String nodeServiceUrl = "http://localhost:8082/materials/" + materialId;
ResponseEntity<MaterialDTO> response = restTemplate.getForEntity(
    nodeServiceUrl, 
    MaterialDTO.class
);
```

### 7.2 Java网关调用Python服务

```java
// Java中使用RestTemplate调用Python服务
String pythonServiceUrl = "http://localhost:8081/borrows";
BorrowRequest request = new BorrowRequest(/*...*/);
ResponseEntity<BorrowDTO> response = restTemplate.postForEntity(
    pythonServiceUrl,
    request,
    BorrowDTO.class
);
```

---

## 八、数据库初始化SQL

### 8.1 人员表
```sql
CREATE TABLE personnels (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    contact VARCHAR(50),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department),
    INDEX idx_role (role)
);
```

### 8.2 物资表
```sql
CREATE TABLE materials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    material_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    total_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    description TEXT,
    purchase_date DATE,
    unit_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_material_code (material_code),
    INDEX idx_category (category),
    INDEX idx_status (status)
);
```

### 8.3 借用记录表
```sql
CREATE TABLE borrows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    borrow_code VARCHAR(50) UNIQUE NOT NULL,
    personnel_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    borrow_date DATETIME NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATETIME,
    status VARCHAR(20) DEFAULT 'borrowed',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_borrow_code (borrow_code),
    INDEX idx_personnel_id (personnel_id),
    INDEX idx_material_id (material_id),
    INDEX idx_status (status)
);
```

---

## 九、测试场景设计

### 9.1 基础CRUD测试
1. 创建人员 → 创建物资 → 创建借用记录
2. 查询所有记录
3. 更新记录
4. 删除记录

### 9.2 跨服务调用测试
1. 通过网关创建完整的借用流程
2. 查询借用详情(包含人员和物资完整信息)
3. 归还物资并更新物资可用数量

### 9.3 异常场景测试
1. 借用不存在的物资
2. 借用数量超过可用数量
3. 不存在的人员借用物资
4. 服务不可用时的降级处理

---

## 十、实现建议

### 10.1 开发顺序
1. 先实现各个微服务的独立功能和API
2. 使用Postman测试各微服务的API
3. 实现Java网关的转发功能
4. 实现跨服务调用的业务组合API
5. 完整集成测试

### 10.2 技术选型建议
- **数据库**: MySQL 5.7+ 或 PostgreSQL
- **Java**: Spring Boot 2.x + MyBatis/JPA + RestTemplate
- **Python**: Flask + Flask-SQLAlchemy + Flask-RESTful
- **Node.js**: Express + Sequelize + Axios
- **测试工具**: Postman

### 10.3 注意事项
1. 确保各服务端口不冲突
2. 统一异常处理和日志记录
3. 实现服务健康检查端点
4. 考虑事务一致性问题
5. 添加请求日志和调用链追踪

---

## 十一、Postman测试集合结构

```
Lab Resource System API
├── Personnels (人员管理)
│   ├── GET All Personnels
│   ├── GET Personnel by ID
│   ├── POST Create Personnel
│   ├── PUT Update Personnel
│   └── DELETE Personnel
├── Materials (物资管理)
│   ├── GET All Materials
│   ├── GET Material by ID
│   ├── POST Create Material
│   ├── PUT Update Material
│   └── DELETE Material
├── Borrows (借用记录)
│   ├── GET All Borrows
│   ├── GET Borrow by ID
│   ├── POST Create Borrow
│   ├── PUT Return Material
│   └── GET Overdue Borrows
└── Business API (业务组合)
    ├── POST Complete Borrow Process
    └── GET Borrow Detail with Full Info
```
