<template>
  <div class="materials-management">
    <div class="page-header">
      <h1 class="page-title">物资管理</h1>
    </div>
    <div class="placeholder-card">
      <el-empty description="功能开发中，敬请期待" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.materials-management {
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.placeholder-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 60px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>