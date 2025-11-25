import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom'

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Estado para o formulário de novo ticket
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'low' });

  // Buscar tickets ao carregar
  useEffect(() => {
    api.get('/tickets/')
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/'); 
        }
        setLoading(false);
      });
  }, [navigate]);

  // Função para criar ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/tickets/', newTicket);
      
      // Adiciona o novo ticket na lista visualmente (sem recarregar)
      setTickets([...tickets, response.data.ticket]);
      
      // Limpa o formulário
      setNewTicket({ title: '', description: '', priority: 'low' });
      alert("Chamado aberto com sucesso!");
    } catch (error) {
      console.error("Erro ao criar ticket", error);
      alert("Erro ao criar ticket.");
    }
  };

  // Função para atualizar status
  const handleStatusChange = async (id, newStatus) => {
    try {
      // 1. Chama o backend (vamos criar essa rota já já)
      await api.put(`/tickets/${id}`, { status: newStatus });
      
      // 2. Atualiza a lista visualmente (map percorre a lista e troca só o que mudou)
      const updatedTickets = tickets.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      );
      setTickets(updatedTickets);
      
    } catch (error) {
      alert("Erro ao atualizar status (Você é admin?)");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Função para cor da prioridade
  const getPriorityColor = (p) => {
    if (p === 'high') return '#dc3545'; // Vermelho
    if (p === 'medium') return '#ffc107'; // Amarelo
    return '#28a745'; // Verde
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Help Desk Pro</h1>
          <p style={{ margin: 0, color: '#666' }}>Bem-vindo, {user?.name} ({user?.role === 'admin' ? 'Administrador' : 'Cliente'})</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </header>

{/* ... código anterior do formulário ... */}

      {/* LISTA DE TICKETS */}
      <section>
        <h3>Meus Chamados ({tickets.length})</h3>
        {loading ? <p>Carregando...</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tickets.map(ticket => (
              <li key={ticket.id} style={{ border: '1px solid #eee', marginBottom: '15px', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                
                {/* Cabeçalho do Card */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.2em' }}>{ticket.title}</strong>
                  <span style={{ backgroundColor: getPriorityColor(ticket.priority), color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8em' }}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>

                {/* Descrição (Agora vai aparecer!) */}
                <p style={{ color: '#555', margin: '10px 0' }}>{ticket.description}</p>
                
                {/* Rodapé com Ação de Status */}
                <div style={{ fontSize: '0.85em', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                  
                  <Link to={`/ticket/${ticket.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                    <strong style={{ fontSize: '1.2em' }}>{ticket.title}</strong>
                    </Link>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>Status:</span>
                    
                    {/* Select para mudar status (Update em tempo real) */}
                    <select 
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      style={{ 
                        padding: '5px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        backgroundColor: ticket.status === 'closed' ? '#e9ecef' : 'white'
                      }}
                    >
                      <option value="open">OPEN</option>
                      <option value="in_progress">IN PROGRESS</option>
                      <option value="closed">CLOSED</option>
                    </select>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FORMULÁRIO DE NOVO TICKET */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>Abrir Novo Chamado</h3>
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Título do problema (ex: Impressora quebrada)" 
            value={newTicket.title}
            onChange={e => setNewTicket({...newTicket, title: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <textarea 
            placeholder="Descreva detalhadamente..." 
            rows="3"
            value={newTicket.description}
            onChange={e => setNewTicket({...newTicket, description: e.target.value})}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              value={newTicket.priority} 
              onChange={e => setNewTicket({...newTicket, priority: e.target.value})}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="low">Baixa Prioridade</option>
              <option value="medium">Média Prioridade</option>
              <option value="high">Alta Prioridade</option>
            </select>
            <button type="submit" style={{ flex: 1, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Abrir Chamado
            </button>
          </div>
        </form>
      </section>

      {/* LISTA DE TICKETS */}
      <section>
        <h3>Meus Chamados ({tickets.length})</h3>
        {loading ? <p>Carregando...</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tickets.length === 0 && <p style={{ color: '#999' }}>Nenhum chamado encontrado.</p>}
            
            {tickets.map(ticket => (
              <li key={ticket.id} style={{ border: '1px solid #eee', marginBottom: '15px', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1.2em' }}>{ticket.title}</strong>
                  <span style={{ 
                    backgroundColor: getPriorityColor(ticket.priority), 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8em' 
                  }}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </div>
                <p style={{ color: '#555', margin: '10px 0' }}>{ticket.description}</p> {/* Aqui faltava description no to_json do backend? Vamos testar */}
                <div style={{ fontSize: '0.85em', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status: <strong>{ticket.status.toUpperCase()}</strong></span>
                  <span>Criado em: {new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;