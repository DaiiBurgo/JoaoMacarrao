# João Macarrão - Documentação da API de Autenticação

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Modelo de Usuário](#modelo-de-usuário)
- [Endpoints](#endpoints)
- [Autenticação JWT](#autenticação-jwt)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

API RESTful completa para autenticação e gerenciamento de usuários do sistema João Macarrão, implementada com Django REST Framework e JWT (JSON Web Tokens).

**Base URL:** `http://localhost:8000/api/`

**Versão:** 2.0.0

---

## 👤 Modelo de Usuário

### Campos Principais

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `username` | String | Nome de usuário único | ✅ |
| `email` | Email | Email único | ✅ |
| `password` | String | Senha (min. 8 caracteres) | ✅ |
| `role` | String | Função do usuário | ✅ |
| `phone_number` | String | Telefone | ❌ |
| `needs_accessibility` | Boolean | Necessita recursos de acessibilidade | ❌ |
| `created_at` | DateTime | Data de criação | Auto |
| `updated_at` | DateTime | Data de atualização | Auto |

### Roles Disponíveis

- **`cliente`**: Usuário padrão do sistema
- **`atendente`**: Funcionário com acesso especial
- **`admin`**: Administrador com acesso total

---

## 🔐 Endpoints

### 1. Registro de Usuário
Cria um novo usuário no sistema.

**Endpoint:** `POST /api/auth/register/`

**Permissões:** Público (não requer autenticação)

**Request Body:**
```json
{
  "username": "cliente1",
  "email": "cliente1@joaomacarrao.com",
  "password": "senha12345",
  "password_confirm": "senha12345",
  "phone_number": "11999998888",
  "role": "cliente",
  "needs_accessibility": false
}
```

**Response (201 Created):**
```json
{
  "message": "Usuário registrado com sucesso!",
  "user": {
    "id": 3,
    "username": "cliente1",
    "email": "cliente1@joaomacarrao.com",
    "role": "cliente",
    "phone_number": "11999998888",
    "date_joined": "2025-10-18T20:41:25.762759-03:00",
    "needs_accessibility": false
  },
  "tokens": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
Autentica um usuário e retorna tokens JWT.

**Endpoint:** `POST /api/auth/login/`

**Permissões:** Público (não requer autenticação)

**Request Body:**
```json
{
  "username": "cliente1",
  "password": "senha12345"
}
```

> **Nota:** Você pode usar `email` no campo `username` para fazer login.

**Response (200 OK):**
```json
{
  "message": "Login realizado com sucesso!",
  "user": {
    "id": 3,
    "username": "cliente1",
    "email": "cliente1@joaomacarrao.com",
    "role": "cliente",
    "phone_number": "11999998888",
    "date_joined": "2025-10-18T20:41:25.762759-03:00",
    "needs_accessibility": false
  },
  "tokens": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Perfil do Usuário (GET)
Retorna dados do usuário autenticado.

**Endpoint:** `GET /api/auth/me/`

**Permissões:** Autenticado (requer token JWT)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Perfil do usuário",
  "user": {
    "id": 3,
    "username": "cliente1",
    "email": "cliente1@joaomacarrao.com",
    "role": "cliente",
    "phone_number": "11999998888",
    "date_joined": "2025-10-18T20:41:25.762759-03:00",
    "needs_accessibility": false
  }
}
```

---

### 4. Atualizar Perfil (PATCH)
Atualiza parcialmente o perfil do usuário autenticado.

**Endpoint:** `PATCH /api/auth/me/`

**Permissões:** Autenticado (requer token JWT)

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body (campos opcionais):**
```json
{
  "phone_number": "11988887777",
  "needs_accessibility": true
}
```

**Response (200 OK):**
```json
{
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": 3,
    "username": "cliente1",
    "email": "cliente1@joaomacarrao.com",
    "role": "cliente",
    "phone_number": "11988887777",
    "date_joined": "2025-10-18T20:41:25.762759-03:00",
    "needs_accessibility": true
  }
}
```

---

### 5. Refresh Token
Obtém um novo access token usando o refresh token.

**Endpoint:** `POST /api/auth/token/refresh/`

**Permissões:** Público (não requer autenticação)

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Nota:** O sistema usa rotação de tokens. Um novo refresh token é gerado a cada refresh.

---

### 6. Verificar Token
Verifica se um token JWT é válido.

**Endpoint:** `POST /api/auth/token/verify/`

**Permissões:** Público (não requer autenticação)

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{}
```

> **Nota:** Resposta vazia significa que o token é válido. Token inválido retorna 401.

---

## 🔑 Autenticação JWT

### Configuração

- **Access Token Lifetime:** 60 minutos
- **Refresh Token Lifetime:** 7 dias
- **Token Rotation:** Habilitado
- **Algorithm:** HS256
- **Header Type:** Bearer

### Como Usar

1. **Faça login** e obtenha os tokens:
```bash
POST /api/auth/login/
```

2. **Use o access token** nas requisições protegidas:
```bash
GET /api/auth/me/
Authorization: Bearer {access_token}
```

3. **Quando o access token expirar**, use o refresh token:
```bash
POST /api/auth/token/refresh/
Body: { "refresh": "{refresh_token}" }
```

---

## 📝 Exemplos de Uso

### PowerShell

#### Registro
```powershell
$body = '{"username":"cliente1","email":"cliente1@joaomacarrao.com","password":"senha12345","password_confirm":"senha12345","role":"cliente"}'
Invoke-RestMethod -Uri "http://localhost:8000/api/auth/register/" -Method POST -Body $body -ContentType "application/json"
```

#### Login
```powershell
$body = '{"username":"cliente1","password":"senha12345"}'
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" -Method POST -Body $body -ContentType "application/json"
$token = $response.tokens.access
```

#### Acessar Perfil
```powershell
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:8000/api/auth/me/" -Method GET -Headers $headers
```

### cURL

#### Registro
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"cliente1","email":"cliente1@joaomacarrao.com","password":"senha12345","password_confirm":"senha12345","role":"cliente"}'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"cliente1","password":"senha12345"}'
```

#### Acessar Perfil
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer {access_token}"
```

---

## 🚨 Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou ausente |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## 🛡️ Segurança

- ✅ Senhas hasheadas com PBKDF2
- ✅ Tokens JWT assinados
- ✅ CORS configurado
- ✅ Validação de email único
- ✅ Validação de senha mínima
- ✅ Rotação de refresh tokens
- ✅ CSRF protection habilitado

---

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

**Desenvolvido com ❤️ para João Macarrão**


