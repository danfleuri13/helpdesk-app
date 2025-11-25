# 🎫 Help Desk Pro - Sistema de Chamados Full-Stack

Um sistema completo de gerenciamento de chamados de suporte (Help Desk), desenvolvido com arquitetura moderna baseada em microsserviços e containerização. O projeto simula um ambiente real corporativo com níveis de acesso (Admin/Cliente), SLA de prioridades e chat em tempo real nos tickets.

## 🚀 Tecnologias Utilizadas

* **Backend:** Python 3.10, Flask, SQLAlchemy (ORM), Flask-JWT-Extended.
* **Frontend:** ReactJS (Vite), React Router Dom, Axios.
* **Banco de Dados:** MySQL 8.0.
* **Infraestrutura:** Docker & Docker Compose (Orquestração completa).

## ✨ Funcionalidades Principais

* 🔐 **Autenticação Segura:** Login via JWT (JSON Web Token) com hash de senhas.
* 👤 **Controle de Acesso (RBAC):**
    * **Clientes:** Abertura de chamados e visualização apenas dos seus tickets.
    * **Admins:** Visualização global, alteração de status e gerenciamento.
* 💬 **Sistema de Comentários:** Chat interativo dentro de cada chamado para histórico de resolução.
* 📊 **Dashboard Interativo:** Atualização em tempo real de novos tickets e status sem recarregar a página (SPA).
* 🐳 **Ambiente Dockerizado:** Setup completo (Back, Front e Banco) com um único comando.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker Desktop instalados.

### Passo a Passo

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU-USUARIO/helpdesk-app.git](https://github.com/SEU-USUARIO/helpdesk-app.git)
    cd helpdesk-app
    ```

2.  Suba os containers (Isso configurará o Banco, Backend e Frontend automaticamente):
    ```bash
    docker-compose up --build
    ```

3.  Acesse a aplicação:
    * **Frontend:** http://localhost:5173
    * **Backend API:** http://localhost:5000

---

### 🧪 Credenciais de Teste

Para testar as funcionalidades de Admin, utilize:
* **Email:** `admin@teste.com`
* **Senha:** `senha-secreta`

---
Desenvolvido por [Seu Nome] como projeto de portfólio Full-Stack.