<template>
  <div class="dashboard">
    <el-header>
      <h1>Nexa POS Dashboard</h1>
      <el-button type="danger" @click="handleLogout">Logout</el-button>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>Input Penjualan</template>
            <el-form :model="transactionForm" label-width="120px">
              <el-form-item label="Tanggal">
                <el-date-picker v-model="transactionForm.transactionDate" type="datetime" />
              </el-form-item>
              <el-form-item label="Metode Bayar">
                <el-select v-model="transactionForm.paymentMethod" placeholder="Pilih">
                  <el-option label="Cash" value="cash" />
                  <el-option label="Card" value="card" />
                  <el-option label="QR" value="qr" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmitTransaction">Simpan</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>Input Pengeluaran</template>
            <el-form :model="expenseForm" label-width="120px">
              <el-form-item label="Tanggal">
                <el-date-picker v-model="expenseForm.expenseDate" type="datetime" />
              </el-form-item>
              <el-form-item label="Deskripsi">
                <el-input v-model="expenseForm.description" />
              </el-form-item>
              <el-form-item label="Jumlah">
                <el-input-number v-model="expenseForm.amount" :min="0" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmitExpense">Simpan</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const transactionForm = reactive({
  transactionDate: new Date(),
  paymentMethod: 'cash',
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  cashierId: null as number | null
})

const expenseForm = reactive({
  expenseDate: new Date(),
  description: '',
  amount: 0,
  category: ''
})

const handleSubmitTransaction = async () => {
  try {
    await axios.post('/api/transactions', transactionForm)
    ElMessage.success('Transaksi berhasil disimpan!')
  } catch (error) {
    ElMessage.error('Gagal menyimpan transaksi')
  }
}

const handleSubmitExpense = async () => {
  try {
    await axios.post('/api/expenses', expenseForm)
    ElMessage.success('Pengeluaran berhasil disimpan!')
  } catch (error) {
    ElMessage.error('Gagal menyimpan pengeluaran')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
}

el-header {
  background: #409eff;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

el-main {
  padding: 20px;
}
</style>
