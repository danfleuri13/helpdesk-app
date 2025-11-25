import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from './services/api';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';

// COMPONENTE DE LOGIN
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <--- O gancho para navegar

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Salva os dados
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // REDIRECIONA PARA O DASHBOARD
      console.log("Redirecionando..."); // <--- Novo log para você ver
      navigate('/dashboard'); 
      
    } catch (err) {
      alert('Login falhou: Verifique email e senha.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <h2>Login HelpDesk</h2>
        <input 
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding: '10px'}}
        />
        <input 
          type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required style={{padding: '10px'}}
        />
        <button type="submit" style={{padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer'}}>
          Entrar
        </button>
      </form>
    </div>
  );
}

// O APP PRINCIPAL (Gerencia as rotas)
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ticket/:id" element={<TicketDetails />} /> {/* <--- Nova Rota */}
    </Routes>
  );
}



export default App;