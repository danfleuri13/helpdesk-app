import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function TicketDetails() {
  const { id } = useParams(); // Pega o ID da URL (ex: ticket/1)
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Busca dados iniciais
  useEffect(() => {
    // 1. Busca detalhes do ticket (precisamos criar uma rota GET /tickets/ID no backend pra ficar perfeito, 
    // mas por enquanto vamos focar nos comentários e assumir que o ticket existe)
    
    // 2. Busca comentários
    api.get(`/comments/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
      
    // Truque: Reusando a lista geral pra achar o ticket (ideal seria uma rota específica, mas serve pro MVP)
    api.get('/tickets/').then(res => {
        const found = res.data.find(t => t.id === parseInt(id));
        setTicket(found);
    });
  }, [id]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if(!newComment.trim()) return;

    try {
      const res = await api.post(`/comments/${id}`, { content: newComment });
      setComments([...comments, res.data]); // Adiciona na tela na hora
      setNewComment('');
    } catch (error) {
      alert("Erro ao enviar comentário");
    }
  };

  if (!ticket) return <div style={{padding: '20px'}}>Carregando detalhes...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', fontFamily: 'Arial' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>&larr; Voltar</button>
      
      {/* CARD DO TICKET */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>{ticket.title} <span style={{fontSize: '0.6em', backgroundColor: '#333', color: '#fff', padding: '3px 8px', borderRadius: '4px'}}>{ticket.status}</span></h2>
        <p style={{ fontSize: '1.1em' }}>{ticket.description}</p>
        <hr />
        
        {/* ÁREA DE CHAT */}
        <h3>Histórico / Comentários</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {comments.length === 0 && <p style={{color: '#999'}}>Nenhum comentário ainda.</p>}
            
            {comments.map(c => (
                <div key={c.id} style={{ 
                    backgroundColor: 'white', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #eee',
                    borderLeft: '4px solid #007bff'
                }}>
                    <strong style={{color: '#007bff'}}>{c.author}</strong> <span style={{fontSize: '0.8em', color: '#aaa'}}>{new Date(c.created_at).toLocaleString()}</span>
                    <p style={{margin: '5px 0'}}>{c.content}</p>
                </div>
            ))}
        </div>

        {/* INPUT DE RESPOSTA */}
        <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Escreva uma resposta..." 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enviar</button>
        </form>

      </div>
    </div>
  );
}

export default TicketDetails;