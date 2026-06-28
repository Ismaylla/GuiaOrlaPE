# Rodando o GuiaOrlaPE no CasaOS

Este guia explica como subir o projeto (banco + API + frontend) no seu servidor
CasaOS usando Docker Compose.

## Visão geral

São 3 containers, todos definidos em [`docker-compose.yml`](docker-compose.yml):

| Container | Porta (host) | O que é |
|-----------|--------------|---------|
| `guiaorla_db` | interna | PostgreSQL 15 |
| `guiaorla_backend` | `5000` | API .NET 9 |
| `guiaorla_frontend` | `3000` | Next.js |

O navegador acessa o **frontend** em `http://SEU_IP:3000` e a **API** em
`http://SEU_IP:5000`. Por isso o `HOST_ADDRESS` precisa ser o IP do servidor —
nunca `localhost` (localhost apontaria para o aparelho de quem está acessando).

---

## Passo 1 — Copie o projeto para o servidor

CasaOS roda sobre Debian + Docker. Acesse o servidor via SSH (ou pelo terminal
embutido do CasaOS) e clone o repositório:

```bash
git clone <url-do-repositorio> guiaorlape
cd guiaorlape
```

## Passo 2 — Configure o `.env`

```bash
cp .env.example .env
nano .env
```

Preencha principalmente:

- `HOST_ADDRESS` → o IP do servidor CasaOS na rede (ex.: `192.168.0.50`).
- `POSTGRES_PASSWORD`, `JWT_KEY`, `NEXTAUTH_SECRET` → valores aleatórios fortes.

> Dica: reserve um IP fixo para o servidor no roteador (DHCP reservation). Se o
> IP mudar, basta atualizar o `.env` e reconstruir o frontend (ver "Trocar o IP").

## Passo 3 — Suba os containers

```bash
docker compose up -d --build
```

A primeira execução baixa as imagens e compila a API e o frontend; pode levar
alguns minutos. Acompanhe os logs com:

```bash
docker compose logs -f
```

## Passo 4 — Acesse

- Frontend: `http://SEU_IP:3000`
- API / Swagger: `http://SEU_IP:5000/swagger`

Os containers aparecem na interface do CasaOS e reiniciam sozinhos (`restart:
unless-stopped`), inclusive após reboot do servidor.

---

## Trocar o IP do servidor

O endereço da API é "assado" no build do frontend. Se o `HOST_ADDRESS` mudar:

```bash
nano .env                       # atualize HOST_ADDRESS
docker compose up -d --build    # reconstrói com o novo endereço
```

## Onde ficam os dados

Em volumes Docker, que persistem entre reinícios e rebuilds:

- `db_data` → banco PostgreSQL
- `uploads_data` → imagens enviadas (fotos de negócios/galeria)

## Acesso por domínio + nginx / HTTPS

> **Por que o backend "para de funcionar" atrás do nginx?**
> Quem chama o backend é o **navegador**, usando a URL que foi gravada no build
> do frontend (`NEXT_PUBLIC_API_URL`). Encaminhar só o frontend pelo nginx não
> basta: o navegador continua tentando o endereço antigo da API, o que dá erro de
> *mixed content* (página HTTPS chamando API HTTP) e de CORS. A API precisa do
> seu próprio endereço público em HTTPS.

> **Use um subdomínio para a API** (ex.: `api.meudominio.com`).
> Não dá para servir a API no mesmo domínio sob `/api`, porque o NextAuth já usa
> `/api/auth/*` no frontend e isso colide com as rotas `/api/auth/...` do backend.

### 1. DNS

Aponte os dois nomes para o IP público/servidor:

- `meudominio.com`      → frontend
- `api.meudominio.com`  → backend

### 2. `.env`

Defina as URLs públicas completas (com `https://`, sem barra no final):

```bash
PUBLIC_FRONTEND_URL=https://meudominio.com
PUBLIC_API_URL=https://api.meudominio.com
```

Reconstrua (o frontend precisa ser recompilado, pois a URL é gravada no build):

```bash
docker compose up -d --build
```

### 3. nginx

Dois `server` blocks (assumindo certificados via certbot/Let's Encrypt):

```nginx
# Frontend
server {
    listen 443 ssl;
    server_name meudominio.com;
    # ssl_certificate / ssl_certificate_key gerenciados pelo certbot

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API (backend)
server {
    listen 443 ssl;
    server_name api.meudominio.com;
    # ssl_certificate / ssl_certificate_key gerenciados pelo certbot

    client_max_body_size 20m;   # necessário para upload das imagens

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> Usando **Nginx Proxy Manager** (comum no CasaOS)? Crie dois *Proxy Hosts*:
> `meudominio.com` → `IP_DO_SERVIDOR:3000` e `api.meudominio.com` →
> `IP_DO_SERVIDOR:5000`, ambos com SSL (Request a new certificate). No host da
> API, aumente o limite de upload em *Advanced* com `client_max_body_size 20m;`.

### Checklist se ainda der erro

- `PUBLIC_API_URL` e `PUBLIC_FRONTEND_URL` definidos **e** frontend reconstruído
  (`--build`) depois de defini-los.
- CORS: a variável `Cors__AllowedOrigins` do backend deve ser **exatamente**
  `https://meudominio.com` (é o que o `PUBLIC_FRONTEND_URL` configura). Confira
  com `docker compose config | grep -i cors`.
- Abra o **DevTools do navegador (F12) > Console/Network**: se a chamada aparece
  como `http://...` (e não `https://`), o frontend não foi reconstruído; se der
  erro de CORS, a origem não bate com `Cors__AllowedOrigins`.
- `api.meudominio.com` precisa ter HTTPS válido (mesmo nível do frontend), senão
  o navegador bloqueia por *mixed content*.

## Comandos úteis

```bash
docker compose ps              # status dos containers
docker compose logs -f backend # logs da API
docker compose down            # para tudo (mantém os dados)
docker compose up -d --build   # sobe novamente / aplica mudanças
```
