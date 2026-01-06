<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete
} from './services/api'

/* STATE */
const tasks = ref([])
const loading = ref(false)
const error = ref('')
const editing = ref(null)
const showForm = ref(false)

/* FILTRO */
const filter = ref('all') // all | pending | done

const filteredTasks = computed(() => {
  if (filter.value === 'done') {
    return tasks.value.filter(t => t.isCompleted)
  }
  if (filter.value === 'pending') {
    return tasks.value.filter(t => !t.isCompleted)
  }
  return tasks.value
})

/* PESQUISA */
const search = ref('')

/* FILTRO + PESQUISA */
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
const perPage = 3

const totalPages = computed(() =>
  Math.ceil(filteredTasksWithSearch.value.length / perPage)
)

const paginatedTasks = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredTasksWithSearch.value.slice(start, start + perPage)
})

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

/* RESET PAGINAÇÃO */
function setFilter(value) {
  filter.value = value
  page.value = 1
}

watch(search, () => {
  page.value = 1
})

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
      tasks.value[idx] = data
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

async function toggleTask(id) {
  const { data } = await toggleComplete(id)
  const idx = tasks.value.findIndex(t => t.id === id)
  tasks.value[idx] = data
}

onMounted(loadTasks)
</script>

<template>
  <div class="wrap">
    <h1>Tarefas</h1>

    <button class="primary" @click="startCreate">
      Nova tarefa
    </button>
    <!-- BARRA DE FILTRO + PESQUISA -->
<div class="filters">
  <div class="filter-buttons">
    <button
      :class="{ active: filter === 'all' }"
      @click="setFilter('all')"
    >
      Todas
    </button>

    <button
      :class="{ active: filter === 'pending' }"
      @click="setFilter('pending')"
    >
      Pendentes
    </button>

    <button
      :class="{ active: filter === 'done' }"
      @click="setFilter('done')"
    >
      Concluídas
    </button>
  </div>

  <input
    type="text"
    v-model="search"
    placeholder="Pesquisar tarefa..."
    class="search"
  />
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
      <button @click="prevPage" :disabled="page === 1">
        Anterior
      </button>

      <span>Página {{ page }} de {{ totalPages }}</span>

      <button @click="nextPage" :disabled="page === totalPages">
        Próxima
      </button>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background-image: url('./assets/images/fundo.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
}

/* CONTAINER MAIS LARGO */
.wrap {
  width: 100%;
  max-width: 1400px;
  margin: auto 3rem;
  padding: 2rem 8rem;

  background: rgba(0,0,0,.7);
  border-radius: 18px;
  display: grid;
  gap: 1rem;
}

/* TÍTULO */
h1 {
  text-align: center;
  color: #00bfa6;
  margin: 0;
}

/* BOTÃO */
.primary {
  align-self: center;
  background: #00bfa6;
  border: none;
  padding: .7rem 1.6rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

/* PAGINAÇÃO */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1rem;
}

.pagination span {
  font-size: .9rem;
  opacity: .8;
}


/* FILTRO + PESQUISA */
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-buttons {
  display: flex;
  gap: .8rem;
}

.filter-buttons button {
  background: #1e1e2f;
  border: 1px solid #333;
  color: #eee;
  padding: .5rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  transition: .2s;
}

.filter-buttons button.active {
  background: #00bfa6;
  color: #000;
  border-color: #00bfa6;
}

.search {
  background: #1e1e2f;
  border: 1px solid #333;
  color: #fff;
  padding: .6rem 1rem;
  border-radius: 10px;
  min-width: 260px;
}
</style>
