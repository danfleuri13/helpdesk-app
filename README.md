# 🎫 Help Desk Pro - Sistema de Chamados Full-Stack

Um sistema completo de gerenciamento de chamados de suporte (Help Desk), desenvolvido com arquitetura moderna baseada em microsserviços e containerização. O projeto simula um ambiente real corporativo com níveis de acesso (Admin/Cliente), SLA de prioridades e chat em tempo real nos tickets.

## 🚀 Tecnologias Utilizadas

* **Backend:** Python 3.10, Flask, SQLAlchemy (ORM), Flask-JWT-Extended.
* **Frontend:** ReactJS (Vite), React Router Dom, Axios.
* **Banco de Dados:** MySQL 8.0.
* **Infraestrutura:** Docker & Docker Compose (Orquestração completa).

## ✨ Funcionalidades Principais

* 🔐 **Autenticação Segura:** Login via JWT (JSON Web Token) com hash de senhas e proteção contra CORS.
* 👤 **Controle de Acesso (RBAC):**
    * **Clientes:** Abertura de chamados e visualização apenas dos seus tickets.
    * **Admins:** Visão global de todos os chamados.
* 🔄 **Workflow de Status:** O Admin pode alterar o status do ticket (Open -> In Progress -> Closed) com atualização dinâmica na tela.
* 💬 **Sistema de Chat:** Comentários e histórico de conversas dentro de cada chamado (Roteamento Dinâmico).
* 🐳 **Ambiente Dockerizado:** Setup completo (Back, Front e Banco) com inicialização automática via Script.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker Desktop instalados.

### Passo a Passo

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU-USUARIO/helpdesk-app.git](https://github.com/SEU-USUARIO/helpdesk-app.git)
    cd helpdesk-app
    ```

2.  Inicie o ambiente (Windows):
    * Execute o arquivo `iniciar.bat` e escolha a opção **[1]**.
    * Ou via terminal: `docker-compose up --build`

3.  Acesse a aplicação:
    * **Frontend:** http://localhost:5173
    * **Backend API:** http://localhost:5000

---

### 🧪 Credenciais de Teste (Admin)

O sistema já vem com um usuário administrador pré-configurado no banco (caso use o seed):
* **Email:** `admin@teste.com`
* **Senha:** `senha-secreta`

---
Desenvolvido como projeto de portfólio Full-Stack.