import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Inicializamos as extensões fora da função para serem globais
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configurações
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///fallback.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-level-up-key'
    
    # Chave secreta para assinar os tokens JWT (em produção, isso viria de um .env escondido)
    app.config['JWT_SECRET_KEY'] = 'super-secret-level-up-key'

    # Inicializa as extensões com a app criada
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    CORS(app, resources={r"/*": {"origins": "*"}}) # Libera o acesso para o React

    from .models import User, Ticket, Comment

    from .routes.auth import auth_bp
    # url_prefix='/api/auth' significa que todas as rotas vão começar assim
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from .routes.tickets import tickets_bp
    app.register_blueprint(tickets_bp, url_prefix='/api/tickets')

    from .routes.comments import comments_bp
    app.register_blueprint(comments_bp, url_prefix='/api/comments')

    # Rota de teste simples para ver se funcionou
    @app.route('/')
    def index():
        return {"message": "API Help Desk rodando com sucesso no Docker!"}

    return app

