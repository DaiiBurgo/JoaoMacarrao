# 🍝 João Macarrão - Backend

**"Tecnologia a serviço do sabor e da inclusão."**

Backend Django 5.2 + Django REST Framework para o sistema João Macarrão.

## 📋 Requisitos

- Python 3.13+
- PostgreSQL 15+ (ou SQLite para desenvolvimento local)
- pip (gerenciador de pacotes Python)

## 🚀 Instalação Local

### 1. Clone o repositório e entre na pasta do backend

```bash
cd backend
```

### 2. Crie e ative um ambiente virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas configurações:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações de banco de dados e outras variáveis necessárias.

**Nota:** Para desenvolvimento local, você pode usar SQLite comentando as configurações de PostgreSQL no arquivo `.env`.

### 5. Execute as migrações do banco de dados

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crie um superusuário (opcional)

```bash
python manage.py createsuperuser
```

### 7. Execute o servidor de desenvolvimento

```bash
python manage.py runserver
```

O servidor estará disponível em: `http://localhost:8000`

## 📚 Estrutura do Projeto

```
backend/
├── apps/
│   ├── core/          # Autenticação e funcionalidades core
│   ├── api/           # Endpoints principais da API
│   └── payments/      # Processamento de pagamentos (placeholder)
├── backend/           # Configurações do Django
│   ├── settings.py    # Configurações principais
│   ├── urls.py        # Rotas principais
│   ├── wsgi.py        # WSGI para deploy
│   └── asgi.py        # ASGI para deploy
├── manage.py          # Utilitário de gerenciamento Django
├── requirements.txt   # Dependências Python
├── .env.example       # Exemplo de variáveis de ambiente
└── README.md          # Este arquivo
```

## 🔌 Endpoints Disponíveis

### Health Check
- `GET /api/health/` - Verifica se a API está funcionando

### Autenticação (stubs)
- `POST /api/auth/register/` - Registro de usuários
- `POST /api/auth/login/` - Login de usuários
- `GET /api/auth/profile/` - Perfil do usuário autenticado (requer autenticação)
- `POST /api/auth/token/refresh/` - Renovar token JWT

### Admin
- `/admin/` - Painel administrativo Django

## 🔐 Autenticação

Este projeto utiliza JWT (JSON Web Tokens) para autenticação via `djangorestframework-simplejwt`.

**Exemplo de uso:**

1. Faça login para obter tokens:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "seu_usuario", "password": "sua_senha"}'
```

2. Use o token de acesso nas requisições:
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Bearer seu_access_token"
```

## 🗄️ Banco de Dados

### PostgreSQL (Produção/Desenvolvimento)

Configure no arquivo `.env`:

```env
DB_NAME=joao_macarrao
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
```

Ou use `DATABASE_URL`:
```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### SQLite (Desenvolvimento Local)

Para usar SQLite durante o desenvolvimento, comente as variáveis de PostgreSQL no `.env`. O Django usará automaticamente `db.sqlite3`.

## 📦 Storage de Mídia

O projeto suporta múltiplos backends de storage:

- **Local** (padrão): Arquivos salvos localmente em `/media`
- **Cloudinary**: Configure `STORAGE_BACKEND=cloudinary` e preencha as variáveis `CLOUDINARY_*`
- **AWS S3**: Configure `STORAGE_BACKEND=s3` e preencha as variáveis `AWS_*`

## 🧪 Comandos Úteis

```bash
# Criar migrações
python manage.py makemigrations

# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Executar servidor
python manage.py runserver

# Executar shell Django
python manage.py shell

# Coletar arquivos estáticos
python manage.py collectstatic

# Executar testes (quando implementados)
python manage.py test
```

## 🔧 Desenvolvimento

### Apps Incluídos

1. **core**: Gerenciamento de usuários, autenticação e funcionalidades core
2. **api**: Endpoints principais da API (produtos, pedidos, etc.)
3. **payments**: Integração com gateways de pagamento (Stripe - a implementar)

### Próximos Passos

- [ ] Implementar lógica completa de autenticação
- [ ] Criar modelos de produtos e categorias
- [ ] Implementar sistema de pedidos
- [ ] Integrar com Stripe para pagamentos
- [ ] Adicionar testes automatizados
- [ ] Implementar sistema de notificações
- [ ] Adicionar funcionalidades de acessibilidade

## 🌐 Deploy

Para deploy em produção:

1. Configure `DEBUG=False` no `.env`
2. Defina um `SECRET_KEY` seguro
3. Configure `ALLOWED_HOSTS` com seu domínio
4. Use um servidor WSGI como Gunicorn ou uWSGI
5. Configure um servidor web (Nginx/Apache) como proxy reverso
6. Use PostgreSQL como banco de dados
7. Configure storage externo (Cloudinary/S3) para mídia

**Exemplo com Gunicorn:**
```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## 📄 Licença

Este projeto está em desenvolvimento para fins educacionais e comerciais.

---

Desenvolvido com ❤️ para levar tecnologia ao sabor e à inclusão.

