<script setup>
defineProps({
  tasks: Array,
  loading: Boolean,
  error: String
})

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset())

  return date.toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="list">
    <p v-if="loading">Carregando...</p>
    <p v-if="error">{{ error }}</p>

    <div
      v-for="task in tasks"
      :key="task.id"
      class="card"
      :class="{ done: task.isCompleted }"
    >
      <div class="top">
        <label class="title">
          <input
            type="checkbox"
            :checked="task.isCompleted"
            @change="$emit('toggle', task.id)"
          />
          <span>{{ task.title }}</span>
        </label>

        <small v-if="task.dueDate">
          Prazo: {{ formatDate(task.dueDate) }}
        </small>
      </div>

      <p class="description">
        {{ task.description }}
      </p>

      <div class="actions">
        <button @click="$emit('edit', task)">Editar</button>
        <button class="danger" @click="$emit('delete', task.id)">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: grid;
  gap: 1.5rem;
}

.card {
  width: 100%;
  background: #24243a;
  padding: 1.6rem;
  border-radius: 16px;
  transition: opacity 0.3s ease, transform 0.2s ease;
}

/* ✅ ESTADO CONCLUÍDO */
.card.done {
  opacity: 0.6;
}

.card.done .title span,
.card.done .description {
  text-decoration: line-through;
}

/* TOPO */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  gap: .6rem;
  font-weight: 500;
}

/* DESCRIÇÃO */
.description {
  margin-top: .8rem;
  line-height: 1.4;
}

/* AÇÕES */
.actions {
  margin-top: 1rem;
  display: flex;
  gap: .8rem;
}

button {
  background: #00bfa6;
  border: none;
  padding: .5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
}

.danger {
  background: #ff5c5c;
}
</style>
