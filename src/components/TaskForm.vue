<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: Object
})

const emit = defineEmits(['save', 'cancel'])

const local = ref({
  title: '',
  description: '',
  dueDate: null,
  isCompleted: false
})

watch(
  () => props.modelValue,
  (v) => {
    local.value = v
      ? {
          ...v,
          dueDate: v.dueDate
            ? v.dueDate.split('T')[0]
            : null
        }
      : {
          title: '',
          description: '',
          dueDate: null,
          isCompleted: false
        }
  },
  { immediate: true }
)

const isEdit = computed(() => !!props.modelValue?.id)

function submit() {
  const payload = {
    ...local.value,
    dueDate: local.value.dueDate
      ? new Date(local.value.dueDate).toISOString()
      : null
  }

  emit('save', payload)
}
</script>

<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <form class="modal" @submit.prevent="submit">
      <h2>{{ isEdit ? 'Editar tarefa' : 'Nova tarefa' }}</h2>

      <div class="grid">
        <div>
          <label>Título</label>
          <input v-model="local.title" required />
        </div>

        <div>
          <label>Prazo</label>
          <input type="date" v-model="local.dueDate" />
        </div>
      </div>

      <div>
        <label>Descrição</label>
        <textarea v-model="local.description"></textarea>
      </div>

      <div class="checkbox">
        <label>
          <input type="checkbox" v-model="local.isCompleted" />
          Concluída
        </label>
      </div>

      <div class="actions">
        <button type="submit">
          {{ isEdit ? 'Salvar' : 'Criar' }}
        </button>
        <button type="button" class="cancel" @click="$emit('cancel')">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: #29293f;
  padding: 3rem;
  border-radius: 18px;
  width: 100%;
  max-width: 760px;
  box-shadow: 0 20px 60px rgba(0,0,0,.8);
}

h2 {
  margin-bottom: 2rem;
  color: #00bfa6;
}

label {
  text-transform: uppercase;
  font-size: .8rem;
  color: #aaa;
}

input, textarea {
  width: 100%;
  padding: .9rem;
  border-radius: 10px;
  border: 1px solid #444;
  background: #1e1e2f;
  color: #eee;
}

textarea {
  min-height: 120px;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.checkbox {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #1e1e2f;
  border-radius: 10px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  border-top: 1px solid #3a3a55;
  padding-top: 1.5rem;
}

.cancel {
  background: #444;
  color: #eee;
}
</style>
