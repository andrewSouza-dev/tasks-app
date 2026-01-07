<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import { useRouter } from 'vue-router' 
import { logout } from '../services/auth'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
} from '../services/api'

/* Rotas */
const router = useRouter()

/* STATE */
const tasks = ref([])
const loading = ref(false)
const error = ref('')
const editing = ref(null)
const showForm = ref(false)

/* FILTRO */
const filter = ref('all')

const filteredTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter(t => t.isCompleted)
  if (filter.value === 'pending') return tasks.value.filter(t => !t.isCompleted)
  return tasks.value
})

/* PESQUISA */
const search = ref('')

const filteredTasksWithSearch = computed(() => {
  let result = filteredTasks.value
  if (search.value.trim()) {
    const text = search.value.toLowerCase()
    result = result.filter(task =>
      task.title.toLowerCase().includes(text) ||
      task.description?.toLowerCase().includes(text)
    )
  }
  return result
})

/* PAGINAÇÃO */
const page = ref(1)
const perPage = 2

const totalPages = computed(() =>
  Math.ceil(filteredTasksWithSearch.value.length / perPage)
)

const paginatedTasks = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredTasksWithSearch.value.slice(start, start + perPage)
})

function handleLogout() { 
    logout() 
    router.push('/login') 
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

function setFilter(value) {
  filter.value = value
  page.value = 1
}

watch(search, () => page.value = 1)

/* CRUD */
async function loadTasks() {
  loading.value = true
  try {
    const { data } = await getTasks()
    tasks.value = data
  } catch {
    error.value = 'Erro ao carregar tarefas'
  } finally {
    loading.value = false
  }
}

function startCreate() {
  editing.value = null
  showForm.value = true
}

function startEdit(task) {
  editing.value = task
  showForm.value = true
}

async function saveTask(payload) {
  try {
    if (editing.value?.id) {
      const { data } = await updateTask(editing.value.id, payload)
      const idx = tasks.value.findIndex(t => t.id === editing.value.id)
      tasks.value[idx] = { ...data }
    } else {
      const { data } = await createTask(payload)
      tasks.value.unshift(data)
    }
    showForm.value = false
  } catch {
    error.value = 'Erro ao salvar tarefa'
  }
}

async function removeTask(id) {
  if (!confirm('Excluir tarefa?')) return
  await deleteTask(id)
  tasks.value = tasks.value.filter(t => t.id !== id)
}

async function toggleTask(task) {
  const { data } = await toggleComplete(task.id)
  const idx = tasks.value.findIndex(t => t.id === task.id)
  // força reatividade
  tasks.value[idx] = { ...data }
}


onMounted(loadTasks)
</script>

<template>
  <div class="header">
    <button class="logout" @click="handleLogout">Sair</button>
  </div>
  <div class="wrap">
    <h1>Tarefas</h1>

    <button class="primary" @click="startCreate">Nova tarefa</button>

    <div class="filters">
      <div class="filter-buttons">
        <button :class="{ active: filter === 'all' }" @click="setFilter('all')">Todas</button>
        <button :class="{ active: filter === 'pending' }" @click="setFilter('pending')">Pendentes</button>
        <button :class="{ active: filter === 'done' }" @click="setFilter('done')">Concluídas</button>
      </div>

      <input v-model="search" class="search" placeholder="Pesquisar tarefa..." />
    </div>

    <TaskForm
      v-if="showForm"
      :modelValue="editing"
      @save="saveTask"
      @cancel="showForm = false"
    />

    <TaskList
      :tasks="paginatedTasks"
      :loading="loading"
      :error="error"
      @edit="startEdit"
      @delete="removeTask"
      @toggle="toggleTask"
    />

    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="page === 1">Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Próxima</button>
    </div>
  </div>
</template>

<style>
/*  HEADER */
.header { 
    display: flex; 
    justify-content: flex-start; 
} 

/* estilos da tela de tarefas */
.wrap {
  width: 90vh;
  max-width: 1000px;
  margin: auto auto;
  padding: 1rem 4rem;
  background: rgba(0,0,0,.7);
  border-radius: 18px;
  display: grid;
  gap: 1rem;
}

h1 {
    display: flex;
    align-items: center;
    justify-content: center;
}


/*  BOTAO NOVA TAREFA */
.primary {
    background-color: rgb(57, 219, 184);
}

.primary:hover {
    background-color: rgb(48, 196, 146);
}



/* FILTROS */
.filters {
   padding: 5px;
}
/* INPUT DE FILTROS */
.search {
   padding: 10px;
   border-radius: 14px;

}

/* BOTAO DE SAIR */
.logout { 
    background: #ff5c5c; 
    border: none; 
    padding: 0.5rem 1rem; 
    border-radius: 8px; 
    color: #fff; 
    font-weight: bold; 
    cursor: pointer; 
}

</style>
