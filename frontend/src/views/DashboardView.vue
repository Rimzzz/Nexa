<template>
  <div class="dashboard">
    <!-- Header -->
    <el-header class="header">
      <div class="header-left">
        <el-icon :size="28" class="logo-icon"><Money /></el-icon>
        <span class="brand">Nexa POS</span>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32">A</el-avatar>
            <span class="username">Admin</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">Profil</el-dropdown-item>
              <el-dropdown-item command="settings">Pengaturan</el-dropdown-item>
              <el-dropdown-item divided command="logout">Keluar</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-main class="main">
      <el-row :gutter="20">
        <!-- Stats Cards -->
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
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowDown, Plus, 
  Shop, Money, TrendCharts 
} from '@element-plus/icons-vue'

const router = useRouter()

const stats = ref([
  { title: 'Total Penjualan', value: 'Rp 0', icon: Shop, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: 'Total Pengeluaran', value: 'Rp 0', icon: Money, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: 'Laba/Rugi', value: 'Rp 0', icon: TrendCharts, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: 'Transaksi', value: '0', icon: Shop, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
])

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
    ElMessage.success('Berhasil logout')
  } else if (command === 'profile') {
    ElMessage.info('Halaman profil')
  } else if (command === 'settings') {
    ElMessage.info('Halaman pengaturan')
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #667eea;
}

.brand {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  font-weight: 500;
  color: #333;
}

.main {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
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
}

.stat-card:hover {
  transform: translateY(-5px);
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
  color: #1a1a2e;
  margin: 0 0 5px;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.action-card {
  border-radius: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  color: #666;
  margin-bottom: 20px;
}

.w-100 {
  width: 100%;
}

.mr-2 {
  margin-right: 8px;
}
</style>
