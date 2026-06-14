# 🌊 GuiaOrlaPE

Plataforma full-stack que conecta turistas a serviços locais em regiões litorâneas de Pernambuco — restaurantes, passeios, hospedagens e muito mais.

---

## 🧱 Arquitetura

```
GuiaOrlaPE/
├── frontend/        → Next.js (Interface Web)
├── backend/         → ASP.NET Core 9 (API REST)
├── docker-compose.yml
└── .env             → variáveis de ambiente (não vai pro Git)
```

---

## ⚙️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js, React, TypeScript, TailwindCSS |
| Backend | .NET 9, ASP.NET Core, Entity Framework |
| Banco | PostgreSQL 15 |
| Infra | Docker, Docker Compose |

---

## 🔗 Endereços após subir

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend / Swagger | http://localhost:5000/swagger |
| Banco (externo) | localhost:5433 |

---

## 🐳 Rodando com Docker (RECOMENDADO)

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Git

### Passo a passo

**1. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd GuiaOrlaPE
```

**2. Crie o arquivo `.env` na raiz do projeto**

> ⚠️ Solicite o conteúdo deste arquivo com a equipe — ele não está no repositório por segurança.

```env
JWT_KEY=sua_chave_jwt_aqui
POSTGRES_PASSWORD=postgres
```

**3. Suba tudo com Docker**
```bash
docker-compose up --build
```

Isso sobe automaticamente o banco, o backend e o frontend.

**4. Acesse**
- Frontend → http://localhost:3000
- Swagger → http://localhost:5000/swagger

### Parar o sistema
```bash
docker-compose down
```

### Reset completo (quando algo dá errado)
```bash
docker-compose down --volumes
docker system prune -f
docker-compose up --build
```

---

## 💻 Rodando localmente (sem Docker)

### Pré-requisitos

- .NET 9 SDK
- Node.js LTS
- PostgreSQL instalado localmente

### 1. Banco de dados

Abra o pgAdmin ou psql e crie o banco:

```sql
CREATE DATABASE guiaorla;
```

### 2. Backend

```bash
cd backend/GuiaOrlaPE.API
```

Configure os secrets locais (substitua `SUA_SENHA` pela sua senha do PostgreSQL):

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=guiaorla;Username=postgres;Password=SUA_SENHA"
dotnet user-secrets set "Jwt:Key" "GuiaOrlaPE_2026_Secret_Key_Alpha_Omega_1854449"
```

Crie as tabelas:

```bash
dotnet ef database update
```

Rode a API:

```bash
dotnet run
```

API disponível em: http://localhost:5148

### 3. Frontend

Em outro terminal:

```bash
cd frontend/guiaorla-frontend
npm install
npm run dev
```

Frontend disponível em: http://localhost:3000

### Rodar tudo de uma vez (opcional)

```bash
npx concurrently "cd backend/GuiaOrlaPE.API && dotnet run" "cd frontend/guiaorla-frontend && npm run dev"
```

---

## 📁 Estrutura de pastas

### Frontend
```
src/
├── app/
├── components/
├── services/
│   └── api.ts   → NEXT_PUBLIC_API_URL=http://localhost:5000
└── styles/
```

### Backend
```
Controllers/
Models/
Domain/
Repository/
Service/
Data/
```

---

## ⚠️ Problemas comuns

**Porta já em uso**

Verifique se algo está usando as portas 3000, 5000 ou 5433:

```bash
docker-compose down
```

ou pare o container específico:

```bash
docker ps
docker stop <id-do-container>
```

**Conflito com PostgreSQL local**

O Docker usa a porta `5433` externamente para não conflitar com o PostgreSQL local (porta `5432`). Se mesmo assim houver conflito, pare o serviço local do PostgreSQL.

**JWT não configurado**

Se o backend não subir e mostrar erro de JWT, verifique se o `.env` está na raiz do projeto com o valor de `JWT_KEY` preenchido.

---

## 🧪 Validando o sistema

Após subir o projeto:

1. Acesse http://localhost:3000 e verifique o carregamento do frontend
2. Acesse http://localhost:5000/swagger e teste os endpoints da API
3. Tente criar uma conta e fazer login
4. Acompanhe os logs do backend com `docker-compose logs -f backend`

---

## 🧠 Boas práticas do projeto

- Separação clara entre frontend e backend
- API centralizada (REST)
- Componentes reutilizáveis no frontend
- Tipagem obrigatória com TypeScript
- Lógica de negócio no backend
- Estilo com TailwindCSS
- Commits pequenos e frequentes
- Nunca versionar o arquivo `.env`