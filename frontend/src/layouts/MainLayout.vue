<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <el-aside :width="isCollapse ? 64 : 200" class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <el-icon :size="24" class="logo-icon"><Money /></el-icon>
          <span v-if="!isCollapse" class="brand">Nexa POS</span>
        </div>
        <el-button
          :icon="isCollapse ? Expand : Fold"
          class="collapse-btn"
          circle
          size="small"
          @click="isCollapse = !isCollapse"
        />
      </div>

      <el-menu
        :default-active="currentRoute"
        :collapse="isCollapse"
        class="sidebar-menu"
        background-color="transparent"
        text-color="var(--color-text)"
        active-text-color="var(--color-primary)"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>Dashboard</template>
        </el-menu-item>
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <template #title>Produk</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container class="main-container">
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32">{{ userInitial }}</el-avatar>
              <span class="username">{{ username }}</span>
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

      <!-- Dynamic Page Content -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowDown, Money, Odometer, Goods,
  Expand, Fold
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapse = ref(false)

const currentRoute = computed(() => {
  return route.path
})

const pageTitle = computed(() => {
  const title = route.meta.title
  return title ? String(title) : 'Dashboard'
})

// User
const username = ref('Admin')
const userInitial = computed(() => {
  const user = localStorage.getItem('user')
  if (!user) return 'A'
  const parsed = JSON.parse(user)
  return (parsed.fullName || parsed.username || 'A').charAt(0).toUpperCase()
})

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    const parsed = JSON.parse(user)
    username.value = parsed.fullName || parsed.username || 'Admin'
  }
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.success('Berhasil logout')
    window.location.href = '/login'
  } else if (command === 'profile') {
    ElMessage.info('Halaman profil')
  } else if (command === 'settings') {
    ElMessage.info('Halaman pengaturan')
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
}

/* === Sidebar === */
.sidebar {
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  min-height: 64px;
  border-bottom: 1px solid var(--color-border);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-heading);
}

.collapse-btn {
  flex-shrink: 0;
  background: var(--color-surface-secondary);
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  background: transparent;
}

.sidebar-menu .el-menu-item {
  margin: 4px 8px;
  border-radius: 10px;
  font-size: 14px;
  transition: background 0.2s;
}

.sidebar-menu .el-menu-item.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}

/* === Main Container === */
.main-container {
  flex: 1;
  min-width: 0;
}

.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-heading);
  margin: 0;
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
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.user-info:hover {
  background: var(--color-surface-secondary);
}

.username {
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text);
}

.main {
  padding: 24px;
}

/* === Responsive === */
@media (max-width: 768px) {
  .sidebar {
    width: 64px !important;
  }
  .brand {
    display: none;
  }
}
</style>
