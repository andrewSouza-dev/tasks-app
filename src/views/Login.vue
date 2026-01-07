<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await login({
      email: email.value,
      password: password.value
    })

    router.push('/tasks')
  } catch {
    error.value = 'Email ou senha inválidos'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="wrap auth">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />

      <button class="primary" :disabled="loading">
        Entrar
      </button>

      <p v-if="error" class="error">{{ error }}</p>

      <p class="link">
        Não tem conta?
        <router-link to="/register">Criar conta</router-link>
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
