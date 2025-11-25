from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('client', 'admin', name='user_roles'), default='client')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    tickets_created = db.relationship('Ticket', foreign_keys='Ticket.created_by', backref='author', lazy=True)
    tickets_assigned = db.relationship('Ticket', foreign_keys='Ticket.assigned_to', backref='technician', lazy=True)

    # CORREÇÃO 1: O to_json do User deve estar aqui e retornar os dados do USUÁRIO
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role
        }

# CORREÇÃO 2: A classe Ticket deve estar FORA da classe User (alinhada à esquerda)
class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum('open', 'in_progress', 'closed', name='ticket_status'), default='open')
    priority = db.Column(db.Enum('low', 'medium', 'high', name='ticket_priority'), default='low')
    
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    comments = db.relationship('Comment', backref='ticket', cascade="all, delete", lazy=True)

    # CORREÇÃO 3: Mantivemos apenas UM to_json (o que tem a description)
    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "author": self.author.name, 
            "created_at": self.created_at.isoformat()
        }

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    ticket_id = db.Column(db.Integer, db.ForeignKey('tickets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento para saber quem comentou
    author = db.relationship('User', backref='comments')

    def to_json(self):
        return {
            "id": self.id,
            "content": self.content,
            "author": self.author.name,
            "created_at": self.created_at.isoformat()
        }