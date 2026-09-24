<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-content">
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-title">{{ stat.title }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Quick Actions -->
    <el-row :gutter="20" class="mt-4">
      <el-col :xs="24" :sm="12">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>Input Penjualan</span>
              <el-tag size="small" type="success">Aktif</el-tag>
            </div>
          </template>
          <p class="description">Buat transaksi penjualan baru</p>
          <el-button type="primary" size="large" class="w-100">
            <el-icon class="mr-2"><Plus /></el-icon>
            Transaksi Baru
          </el-button>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="action-card">
          <template #header>
            <div class="card-header">
              <span>Input Pengeluaran</span>
              <el-tag size="small" type="danger">Aktif</el-tag>
            </div>
          </template>
          <p class="description">Catat pengeluaran harian</p>
          <el-button type="danger" size="large" class="w-100">
            <el-icon class="mr-2"><Plus /></el-icon>
            Pengeluaran Baru
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus,
  Shop, Money, TrendCharts
} from '@element-plus/icons-vue'

const stats = ref([
  { title: 'Total Penjualan', value: 'Rp 0', icon: Shop, color: 'var(--color-primary)' },
  { title: 'Total Pengeluaran', value: 'Rp 0', icon: Money, color: 'var(--color-danger)' },
  { title: 'Laba/Rugi', value: 'Rp 0', icon: TrendCharts, color: 'var(--color-info)' },
  { title: 'Transaksi', value: '0', icon: Shop, color: 'var(--color-success)' }
])
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--color-background);
}

.mt-4 {
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  transition: transform 0.3s;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-primary);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-heading);
  margin: 0 0 5px;
}

.stat-title {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.action-card {
  border-radius: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.w-100 {
  width: 100%;
}

.mr-2 {
  margin-right: 8px;
}
</style>
