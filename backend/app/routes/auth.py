from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..models import User, db

# Criamos um "pedaço" do app chamado 'auth'
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 1. Validação básica
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Dados incompletos"}), 400
    
    # 2. Verificar se usuário já existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email já cadastrado"}), 400
    
    # 3. Criar o Hash da senha (Segurança Máxima)
    hashed_password = generate_password_hash(data['password'])
    
    # 4. Salvar no banco
    new_user = User(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password,
        role=data.get('role', 'client') # Por padrão é cliente
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "Usuário criado com sucesso!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # 1. Buscar usuário pelo email
    user = User.query.filter_by(email=data.get('email')).first()
    
    # 2. Verificar se o usuário existe E se a senha bate com o hash
    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({"msg": "Email ou senha incorretos"}), 401
    
    # 3. Gerar o Token JWT (O Crachá)
    # identity é o que vai ficar guardado dentro do token (geralmente o ID)
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "token": access_token,
        "user": user.to_json()
    }), 200