<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/auth'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true

  if (password.value.length < 6) 
  { 
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    loading.value = false 
    return 
  }
  
  try {
    await register({
      username: name.value,
      email: email.value,
      password: password.value
    })

    router.push('/login')
  } catch (err) {
    error.value = err.message || 'Erro ao registrar usuário'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wrap auth">
    <h1>Registro</h1>

    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="Nome" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />

      <button class="primary" :disabled="loading">
        Criar conta
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="link">
        Já tem conta?
        <router-link to="/login">Entrar</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth {
  max-width: 420px;
}

form {
  display: grid;
  gap: 1rem;
}

input {
  padding: .7rem;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1e1e2f;
  color: #fff;
}

.error {
  color: #ff6b6b;
  text-align: center;
}

.link {
  text-align: center;
  font-size: .9rem;
}
</style>
