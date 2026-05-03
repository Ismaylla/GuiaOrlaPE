# 🌊 GuiaOrlaPE — Documentação de Setup

Bem-vindo(a) ao projeto **GuiaOrlaPE** 🚀
Este repositório contém o sistema completo (frontend, backend e banco de dados) utilizado para conectar turistas a serviços locais em regiões litorâneas de Pernambuco.

---

# 📌 Visão Geral do Projeto

O **GuiaOrlaPE** é uma plataforma full-stack que permite:

* Visualização de serviços locais (restaurantes, passeios, hospedagens etc.)
* Busca e filtros por categoria
* Interface responsiva para turistas e empreendedores
* API centralizada para gerenciamento de dados
* Persistência em banco PostgreSQL

---

# 🧱 Arquitetura

O sistema é dividido em três partes principais:

```
GuiaOrlaPE/
│
├── frontend/   → Next.js (Interface Web)
├── backend/    → API em .NET
├── docker/     → Banco de dados PostgreSQL
```

---

# ⚙️ Tecnologias Utilizadas

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

## Backend

* .NET 9 (ASP.NET Core)
* API REST

## Banco de Dados

* PostgreSQL 15

## Infraestrutura

* Docker
* Docker Compose

---

# 🚀 Como rodar o projeto completo

## 📌 Pré-requisitos

Instale antes de começar:

* Node.js (18+)
* .NET SDK (9+)
* Docker + Docker Compose
* Git

---

## 🐳 1. Rodando tudo com Docker (RECOMENDADO)

Na raiz do projeto:

```bash id="z7qv5x"
docker-compose up --build
```

Isso irá subir automaticamente:

* 🐘 PostgreSQL
* ⚙️ Backend (.NET API)
* 🌐 Frontend (Next.js)

---

## 🌍 Acessos após subir

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:5000](http://localhost:5000)
* Banco de dados → localhost:5433

---

## 🛑 Parar o sistema

```bash id="k0p9ww"
docker-compose down
```

---

# 💻 2. Rodando localmente (sem Docker)

## 📦 Frontend

```bash id="3c9m2q"
cd frontend/guiaorla-frontend
npm install
npm run dev
```

👉 [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Backend

```bash id="xq8n1t"
cd backend/GuiaOrlaPE.API
dotnet run
```

👉 [http://localhost:5000](http://localhost:5000)

---

## 🐘 Banco de Dados (local)

Você precisa de PostgreSQL rodando:

```bash id="v0p4aa"
Host: localhost
Port: 5433
Database: guiaorla
User: postgres
Password: postgres
```

---

# 🔗 Comunicação entre sistemas

O frontend consome a API via:

```ts id="7k2q9p"
API_URL = "http://localhost:5000"
```

📁 Arquivo:

```
frontend/src/services/api.ts
```

---

# 📁 Estrutura geral

```
frontend/
backend/
docker-compose.yml
```

---

## Frontend

```
src/
├── app/
├── components/
├── services/
├── styles/
```

## Backend

```
Controllers/
Models/
Services/
Data/
```

---

# 🧠 Regras e boas práticas

✔ Separação clara entre frontend e backend
✔ API centralizada (REST)
✔ Componentes reutilizáveis no frontend
✔ Tipagem obrigatória (TypeScript)
✔ Lógica de negócio no backend
✔ Estilo com TailwindCSS

---

# 🧪 Como validar o sistema

Após subir o projeto:

1. Abrir [http://localhost:3000](http://localhost:3000)
2. Verificar carregamento do frontend
3. Testar chamadas para API
4. Confirmar dados vindo do banco
5. Validar logs do backend

---

# ⚠️ Problemas comuns

## Porta já em uso

* 3000 → frontend
* 5000 → backend
* 5433 → banco

Solução:

```bash id="k8n3ld"
docker-compose down
```

ou matar processos:

```bash id="m2q9zz"
docker ps
docker stop <container>
```

---

## Conflito com PostgreSQL local

Se tiver PostgreSQL instalado no Windows, ele pode ocupar a porta 5432.

👉 Solução: o projeto já usa 5433 no Docker.

---

# 🧹 Reset completo (quando tudo dá errado)

```bash id="r1c9pp"
docker system prune -a
```

⚠️ Remove containers, imagens e cache não utilizados.

---

# ✨ Dicas de desenvolvimento

* Use Docker para ambiente completo
* Use `npm run dev` no frontend para hot reload
* Use `dotnet watch run` no backend
* Commits pequenos e frequentes
* Sempre testar API antes do frontend

---

# 📌 Observação final

Este projeto foi estruturado para funcionar tanto:

* em ambiente Docker (produção/dev completo)
* quanto localmente (desenvolvimento manual)
