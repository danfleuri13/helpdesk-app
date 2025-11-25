from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Comment, Ticket, User, db

comments_bp = Blueprint('comments', __name__)

# ROTA 1: POSTAR COMENTÁRIO EM UM TICKET
@comments_bp.route('/<int:ticket_id>', methods=['POST'])
@jwt_required()
def add_comment(ticket_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data.get('content'):
        return jsonify({"msg": "Comentário vazio"}), 400

    new_comment = Comment(
        content=data['content'],
        ticket_id=ticket_id,
        user_id=current_user_id
    )
    
    db.session.add(new_comment)
    db.session.commit()
    
    return jsonify(new_comment.to_json()), 201

# ROTA 2: LER COMENTÁRIOS DE UM TICKET
@comments_bp.route('/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_comments(ticket_id):
    # Busca comentários ordenados pelos mais antigos primeiro (ordem de chat)
    comments = Comment.query.filter_by(ticket_id=ticket_id).order_by(Comment.created_at.asc()).all()
    return jsonify([c.to_json() for c in comments]), 200