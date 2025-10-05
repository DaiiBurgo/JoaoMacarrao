# 🍝 João Macarrão - Cardápio Digital com Inclusão Audiovisual
Projeto Integrador - UNIVESP
Eixo: Tecnologia da Informação e Computação

# 📖 Visão Geral - "Tecnologia a serviço do sabor e da inclusão."

O João Macarrão é um restaurante de massas artesanais que busca unir sabor, tecnologia e inclusão.
Este projeto consiste em um cardápio digital interativo e acessível, que permite ao cliente visualizar os pratos, ouvir suas descrições, assistir a vídeos curtos e realizar pedidos e pagamentos diretamente pelo aplicativo.

O sistema é projetado com inclusão audiovisual, sendo acessível para pessoas com deficiência visual ou auditiva, e utiliza uma arquitetura web moderna e responsiva.

# 🍽️ Funcionalidades Principais

👥 Usuários e Administração
- Cadastro e autenticação de usuários (clientes, atendentes, admin).
- Painel administrativo com gerenciamento de pratos, categorias e mídias.
- Controle de disponibilidade e estoque.

📋 Cardápio Digital Interativo
- Exibição por categorias: Massas, Molhos, Acompanhamentos, Bebidas e Sobremesas.
- Descrições narradas por áudio e vídeos demonstrativos.
- Filtros e busca por nome ou tipo de prato.
- Modo acessível (alto contraste, fontes ampliadas e tradução em Libras).

🎧 Inclusão Audiovisual
- Áudio narrado das descrições via Google Cloud Text-to-Speech.
- Vídeos curtos integrados (pré-preparo e apresentação do prato).
- Tradução para Libras com VLibras API ou Hand Talk Plugin.

💳 Pagamento In-App
- Integração com APIs de pagamento seguras, permitindo concluir pedidos pelo app.
- Métodos suportados:
- Pix (via API do Mercado Pago, PagBank ou Gerencianet).
- Cartão de crédito/débito (Stripe, Mercado Pago ou PayPal SDK).
- Pagamento no local (opção para pedidos presenciais).
- Histórico de pedidos e comprovantes acessíveis ao usuário.

💬 Contato e Feedback
- Formulário de contato direto com o restaurante.
- Avaliação dos pratos e feedback de experiência.

# 🧱 Arquitetura do Sistema

## 🖥️ Backend

- Linguagem: Python 3.13+
- Framework: Django 5.2
- API REST: Django REST Framework
- Banco de Dados: PostgreSQL
- Gerenciamento de Mídia: Cloudinary / AWS S3
- Autenticação: JWT (SimpleJWT)
- Integrações Externas:
- Google Cloud TTS (áudio narrado)
- VLibras API (acessibilidade em Libras)
- Stripe / Mercado Pago API (pagamentos online)

# 💻 Frontend
- Framework: React + TypeScript
- Biblioteca de UI: Material UI (MUI)
- Gerenciamento de Estado: Redux Toolkit
- Roteamento: React Router
- Comunicação com API: Axios
- Acessibilidade: react-aria / react-a11y
- Multimídia: React Player + Web Speech API
- Pagamentos: Stripe.js / MercadoPago.js SDK

# 🗂️ Estrutura do Projeto

joao-macarrao/
│
├── backend/
│   ├── core/
│   ├── api/
│   ├── payments/
│   ├── static/
│   ├── media/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
│
└── README.md

# ⚙️ Requisitos de Sistema

- Python: 3.13+
- Node.js: 18+
- PostgreSQL: 14+
- PgAdmin: 4+
- Conta de Desenvolvedor: Stripe, Mercado Pago ou PayPal

# 🧩 Configuração do Ambiente
## Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend
```bash
cd frontend
npm install
npm start
```

# 🌐 Acessos

- Backend: http://localhost:8000
- Admin Django: http://localhost:8000/admin
- API REST: http://localhost:8000/api
- Frontend: http://localhost:3000

# 🧠 Boas Práticas e Padrões

## O projeto segue princípios de:
- Arquitetura RESTful
- Componentização e reutilização de código (React + DRY)
- Acessibilidade Web (WCAG 2.1 AA)
- Segurança em transações (HTTPS, JWT, CSRF)
- Versionamento com Git e GitHub
- Deploy em nuvem (Render, Railway, ou Vercel)

# 👩‍💻 Autores
Projeto desenvolvido por alunos da UNIVESP como parte do Projeto Integrador.

- [Daii Burgo]

## Membros do grupo

- [Daiana S. Lespier]
- [Filipe S. Gomes]
- [Helder L. P. Costa]
- [João Vitor V. de Oliveira]
- [Regina Mancini]
- [Welinton Arantes]
- [Yolanda Maria Fanucchi]

# 📄 Licença

Este projeto está licenciado sob a MIT License.
