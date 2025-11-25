from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Ticket, User, db

tickets_bp = Blueprint('tickets', __name__)

# ROTA 1: CRIAR TICKET
@tickets_bp.route('/', methods=['POST'])
@jwt_required() # <--- O porteiro: só entra com token válido
def create_ticket():
    current_user_id = get_jwt_identity() # Pega o ID de quem está logado
    data = request.get_json()
    
    new_ticket = Ticket(
        title=data['title'],
        description=data['description'],
        created_by=current_user_id,
        priority=data.get('priority', 'low')
    )
    
    db.session.add(new_ticket)
    db.session.commit()
    
    return jsonify({"msg": "Ticket criado!", "ticket": new_ticket.to_json()}), 201

# ROTA 2: LISTAR TICKETS (Com regra de negócio)
@tickets_bp.route('/', methods=['GET'])
@jwt_required()
def get_tickets():
    current_user_id = get_jwt_identity()
    
    # Buscamos quem é o usuário para saber o papel (role) dele
    user = User.query.get(current_user_id)
    
    if user.role == 'admin':
        # Admin vê tudo
        tickets = Ticket.query.all()
    else:
        # Cliente vê só os seus
        tickets = Ticket.query.filter_by(created_by=current_user_id).all()
        
    return jsonify([t.to_json() for t in tickets]), 200

# ROTA 3: ATUALIZAR TICKET (Mudar status)
@tickets_bp.route('/<int:ticket_id>', methods=['PUT'])
@jwt_required()
def update_ticket(ticket_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    
    ticket = Ticket.query.get_or_404(ticket_id)
    
    # Regra de Negócio: Só Admin ou o Dono pode mexer (ou podemos restringir só pra admin)
    # Aqui vou deixar livre pra gente testar, mas num sistema real seria restrito
    
    if 'status' in data:
        ticket.status = data['status']
        
    db.session.commit()
    
    return jsonify({"msg": "Atualizado!", "ticket": ticket.to_json()}), 200

