<template>
  <div class="not-found">
    <el-result icon="warning" title="404" sub-title="Halaman tidak ditemukan">
      <template #extra>
        <el-button type="primary" @click="$router.push('/login')">
          Kembali ke Login
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
</style>
