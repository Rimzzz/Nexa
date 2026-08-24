<template>
  <div class="login-container">
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <el-row type="flex" justify="center" align="middle" class="h-100">
      <el-col :xs="20" :sm="16" :md="12" :lg="8" :xl="6">
        <div class="login-card">
          <!-- Logo & Title -->
          <div class="login-header">
            <div class="logo-container">
              <el-icon class="logo-icon" :size="40">
                <Money />
              </el-icon>
            </div>
            <h1 class="login-title">Nexa POS</h1>
            <p class="login-subtitle">Point of Sale System</p>
          </div>

          <!-- Login Form -->
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <!-- Username Input -->
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="Email atau Username"
                prefix-icon="User"
                :disabled="loading"
                size="large"
                autocomplete="username"
              />
            </el-form-item>

            <!-- Password Input -->
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="Password"
                prefix-icon="Lock"
                :disabled="loading"
                size="large"
                show-password
                autocomplete="current-password"
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <!-- Remember Me & Forgot Password -->
            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="form.remember">Ingat saya</el-checkbox>
                <el-link type="primary" :underline="false" class="forgot-link">
                  Lupa password?
                </el-link>
              </div>
            </el-form-item>

            <!-- Login Button -->
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="login-button"
                size="large"
                @click="handleLogin"
              >
                <el-icon v-if="!loading" class="mr-2"><SwitchButton /></el-icon>
                {{ loading ? 'Memproses...' : 'Masuk' }}
              </el-button>
            </el-form-item>

            <!-- Divider -->
            <el-divider class="divider">
              <span class="divider-text">atau</span>
            </el-divider>

            <!-- Demo Account Info -->
            <div class="demo-info">
              <el-icon><InfoFilled /></el-icon>
              <span>Demo Account:</span>
              <code>admin@nexa.local / admin123</code>
            </div>

            <!-- Register Link -->
            <div class="register-link">
              <span>Belum punya akun?</span>
              <el-link type="primary" :underline="false">
                Daftar sekarang
              </el-link>
            </div>
          </el-form>
        </div>

        <!-- Footer -->
        <div class="login-footer">
          <p>&copy; 2024 Nexa POS. All rights reserved.</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SwitchButton, InfoFilled, Money } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: 'Username wajib diisi', trigger: 'blur' },
    { min: 3, message: 'Minimal 3 karakter', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password wajib diisi', trigger: 'blur' },
    { min: 6, message: 'Minimal 6 karakter', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo authentication (temporary)
      if (form.username === 'admin@nexa.local' && form.password === 'admin123') {
        ElMessage.success('Login berhasil! Selamat datang~')
        // Store demo token
        localStorage.setItem('token', 'demo-token-123')
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: 'admin@nexa.local',
          fullName: 'Administrator',
          role: 'admin'
        }))
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        ElMessage.error('Username atau password salah!')
      }
      
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

/* Background decorations */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: #e94560;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: #0f3460;
  bottom: -50px;
  left: -50px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: #533483;
  top: 50%;
  left: 50%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.h-100 {
  height: 100%;
  flex: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin: 20px 0;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.logo-icon {
  color: white;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 5px;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-form {
  width: 100%;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.forgot-link {
  font-size: 13px;
}

.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.divider {
  margin: 25px 0;
}

.divider-text {
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.95);
  padding: 0 10px;
}

.demo-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #0369a1;
}

.demo-info code {
  background: #e0f2fe;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-footer {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* Element Plus overrides */
:deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 8px 15px;
}

:deep(.el-form-item__error) {
  padding-top: 5px;
}

/* Responsive */
@media (max-width: 576px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style>
