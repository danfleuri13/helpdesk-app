import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Endereço do nosso Backend
});

// INTERCEPTOR (Conceito Avançado)
// Antes de cada requisição, o axios verifica se tem um token salvo
// Se tiver, ele anexa o token no cabeçalho automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;