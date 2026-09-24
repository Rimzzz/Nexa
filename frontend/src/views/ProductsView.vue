<template>
  <div class="products-page">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">Manajemen Produk</h2>
      <el-button type="primary" @click="openCreateDialog">
        <el-icon><Plus /></el-icon> Tambah Produk
      </el-button>
    </div>

    <!-- Search & Filter -->
    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-input
            v-model="search"
            placeholder="Cari produk..."
            clearable
            :prefix-icon="Search"
          />
        </el-col>
        <el-col :span="8">
          <el-select v-model="filterCategory" placeholder="Semua Kategori" clearable>
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Products Table -->
    <el-card class="table-card">
      <el-table :data="filteredProducts" v-loading="loading" stripe>
        <el-table-column prop="name" label="Nama Produk" min-width="180">
          <template #default="{ row }">
            <div class="product-name">
              <el-icon class="product-icon"><Goods /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="Kategori" width="120">
          <template #default="{ row }">
            <el-tag size="small" type="info" effect="plain">
              {{ row.category || 'Umum' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="Harga" width="140">
          <template #default="{ row }">
            <span class="price">Rp {{ formatRupiah(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="Stok" width="100">
          <template #default="{ row }">
            <el-tag :type="stockType(row.stock)" size="small">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'" size="small">
              {{ row.isActive ? 'Aktif' : 'Nonaktif' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Aksi" width="160" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="openEditDialog(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="totalItems"
          layout="prev, pager, next, total"
        />
      </div>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? 'Edit Produk' : 'Tambah Produk'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="Nama" prop="name">
          <el-input v-model="form.name" placeholder="Nama produk" />
        </el-form-item>
        <el-form-item label="Kategori" prop="category">
          <el-select v-model="form.category" placeholder="Pilih kategori" clearable>
            <el-option
              v-for="cat in categories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Harga" prop="price">
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="Stok" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Deskripsi" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Deskripsi produk"
          />
        </el-form-item>
        <el-form-item label="Status" prop="isActive">
          <el-switch v-model="form.isActive" active-text="Aktif" inactive-text="Nonaktif" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          Simpan
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Goods, Search } from '@element-plus/icons-vue'
import { http } from '../services/api'

interface Product {
  id?: number
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  barcode?: string
  isActive: boolean
}

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const search = ref('')
const filterCategory = ref('')
const page = ref(1)
const pageSize = ref(10)

const categories = ref(['Umum', 'Elektronik', 'Makanan', 'Minuman', 'Fashion', 'Lainnya'])

const form = reactive<Product>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  isActive: true
})

const products = ref<Product[]>([])

const rules = {
  name: [
    { required: true, message: 'Nama wajib diisi', trigger: 'blur' },
    { min: 2, message: 'Minimal 2 karakter', trigger: 'blur' }
  ],
  price: [
    { required: true, message: 'Harga wajib diisi', trigger: 'blur' },
    { type: 'number' as const, min: 0, message: 'Harga tidak boleh negatif', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: 'Stok wajib diisi', trigger: 'blur' },
    { type: 'number' as const, min: 0, message: 'Stok tidak boleh negatif', trigger: 'blur' }
  ]
}

const formRef = ref()
const totalItems = computed(() => products.value.length)

const filteredProducts = computed(() => {
  let result = products.value

  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }

  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }

  return result
})

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const stockType = (stock: number): string => {
  if (stock <= 0) return 'danger'
  if (stock <= 10) return 'warning'
  return 'success'
}

const openCreateDialog = () => {
  isEditing.value = false
  editingId.value = null
  Object.assign(form, { name: '', description: '', price: 0, stock: 0, category: '', isActive: true })
  dialogVisible.value = true
}

const openEditDialog = (product: Product) => {
  isEditing.value = true
  editingId.value = product.id || null
  Object.assign(form, {
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category: product.category || '',
    isActive: product.isActive
  })
  dialogVisible.value = true
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await http.get('/items', {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Map backend camelCase to frontend PascalCase
    products.value = (res.data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      stock: item.stock,
      category: item.category,
      barcode: item.barcode,
      isActive: item.is_active
    }))
  } catch (e: any) {
    if (e.response?.status === 401) {
      ElMessage.error('Sesi habis, silakan login ulang')
      localStorage.removeItem('token')
      window.location.href = '/login'
      return
    }
    ElMessage.error('Gagal memuat data produk')
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    submitting.value = true
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (isEditing.value && editingId.value) {
        await http.put(`/items/${editingId.value}`, form, { headers })
        ElMessage.success('Produk berhasil diperbarui')
      } else {
        await http.post('/items', form, { headers })
        ElMessage.success('Produk berhasil ditambahkan')
      }
      dialogVisible.value = false
      await fetchProducts()
    } catch (e: any) {
      ElMessage.error(e.response?.data?.message || 'Gagal menyimpan produk')
    } finally {
      submitting.value = false
    }
  })
}

const handleDelete = async (product: Product) => {
  try {
    await ElMessageBox.confirm(
      `Hapus produk "${product.name}"?`,
      'Konfirmasi Hapus',
      { type: 'warning', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' }
    )
  } catch {
    return
  }

  try {
    const token = localStorage.getItem('token')
    await http.delete(`/items/${product.id}`, { headers: { Authorization: `Bearer ${token}` } })
    ElMessage.success('Produk berhasil dihapus')
    await fetchProducts()
  } catch (e: any) {
    ElMessage.error('Gagal menghapus produk')
  }
}
</script>

<style scoped>
.products-page {
  background: var(--color-background);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-heading);
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.table-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.product-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.product-icon {
  color: var(--color-primary);
}

.price {
  font-weight: 600;
  color: var(--color-text-heading);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  --el-table-bg-color: var(--color-surface);
  --el-table-tr-bg-color: var(--color-surface);
  --el-table-header-bg-color: var(--color-surface-secondary);
  --el-table-row-hover-bg-color: var(--color-surface-secondary);
  --el-table-border-color: var(--color-border);
  --el-table-text-color: var(--color-text);
  --el-table-header-text-color: var(--color-text-heading);
}
</style>
