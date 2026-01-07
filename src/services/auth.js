import api from './api'

/* LOGIN */
export const login = async ({ email, password }) => {
  try {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)  // garante que o token seja salvo
    return data // opcional, caso queira usar info do usuário
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Erro ao logar')
  }
}

/* REGISTRO */
export const register = async ({ username, email, password }) => 
    {
        try { 
            const { data } = await api.post('/auth/register', { username, email, password }) 
            return data
        } catch (err) { 
            throw new Error(err.response?.data?.error || 'Erro ao registrar') 
        } }

/* LOGOUT */
export const logout = () => {
  localStorage.removeItem('token')
}

/* AUTH CHECK */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}
