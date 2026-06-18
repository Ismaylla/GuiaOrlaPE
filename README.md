# 🌊 GuiaOrlaPE

Plataforma full-stack que conecta turistas a serviços locais em regiões litorâneas de Pernambuco.

---

# 🧱 Arquitetura do Projeto

```bash
GuiaOrlaPE/
├── frontend/                         # Next.js (Interface Web)
├── backend/                          # ASP.NET Core 9 (API REST)
├── docker-compose.yml
└── appsettings.example.json          # Modelo de configuração do Backend
```

---

# ⚙️ Tecnologias Utilizadas

| Camada         | Tecnologias                                    |
| -------------- | ---------------------------------------------- |
| Frontend       | Next.js, React, TypeScript, TailwindCSS, Axios |
| Backend        | .NET 9, ASP.NET Core, Entity Framework Core    |
| Banco de Dados | PostgreSQL 15                                  |
| Infraestrutura | Docker, Docker Compose                         |

---

# 🐳 Executando com Docker (RECOMENDADO)

## 1. Preparação dos Segredos (OBRIGATÓRIO)

Para que o projeto funcione corretamente, é necessário configurar os segredos e credenciais locais que não estão versionados no repositório.

---

# 📄 Configuração do Backend

Copie o arquivo:

```bash
backend/GuiaOrlaPE.API/appsettings.example.json
```

para:

```bash
backend/GuiaOrlaPE.API/appsettings.json
```

Depois, configure corretamente as seções:

* `"Email"`
* `"ConnectionStrings"`

Exemplo:

```json
{
  "Email": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "User": "seu_email@gmail.com",
    "Password": "sua_senha_de_app",
    "From": "seu_email@gmail.com"
  },

  "ConnectionStrings": {
    "DefaultConnection": "Host=db;Port=5432;Database=guiaorla;Username=postgres;Password=SUA_SENHA_DO_POSTGRES"
  }
}
```

---

# ⚠️ Importante sobre Gmail

Caso utilize Gmail como serviço SMTP:

* NÃO utilize sua senha principal da conta Google.
* Gere uma **Senha de App** nas configurações de segurança da conta Google.
* Certifique-se de que a autenticação em duas etapas esteja ativada.

---

# 🔐 Variáveis de Ambiente

As variáveis abaixo precisam existir no ambiente da aplicação:

```env
POSTGRES_PASSWORD=sua_senha
JWT_KEY=sua_chave_jwt_secreta
```

Você pode:

* Definir diretamente no sistema operacional;
* Utilizar variáveis no Docker;
* Ou criar manualmente um arquivo `.env` para uso local.

> O arquivo `.env` é opcional no projeto atual e não deve ser versionado.

---

# 🚀 Subindo o Ambiente

Certifique-se de que o Docker Desktop esteja aberto e rodando.

Execute na raiz do projeto:

```bash
docker-compose up --build
```

---

# 🛑 Derrubando o Ambiente

Para parar todos os containers do projeto:

```bash
docker-compose down
```

---

# 🧹 Limpando Todo o Ambiente (RESET COMPLETO)

Caso ocorra algum problema de:

* Banco corrompido
* Erro de coluna
* Conflito de migrations
* Dados quebrados
* Containers inconsistentes
* Cache do Docker

Execute:

```bash
docker-compose down -v
```

Esse comando:

* Remove os containers
* Remove os volumes do PostgreSQL
* Apaga completamente os dados do banco
* Força recriação limpa do ambiente

Depois, execute novamente:

```bash
docker-compose up --build
```

---

# ⚠️ Pontos Críticos da Infraestrutura

## 🔄 Sincronização Banco ↔ Código

O projeto utiliza:

```csharp
db.Database.EnsureCreated();
```

no `Program.cs`.

Isso garante que o banco seja criado automaticamente conforme a estrutura atual das entidades C#.

Caso ocorra erro relacionado a colunas ou estrutura do banco, utilize:

```bash
docker-compose down -v
```

para recriar completamente o banco.

---

## 🔐 Segurança

Nunca envie para o Git:

* `appsettings.json`
* `.env`
* Credenciais SMTP
* Chaves JWT
* Senhas de banco

O `.gitignore` do projeto já está configurado para proteger arquivos sensíveis.

---

## 🌐 Comunicação Interna entre Containers

Dentro do Docker, o frontend se comunica com o backend utilizando:

```txt
http://backend:8080
```

Isso ocorre porque os containers utilizam a rede interna do Docker Compose.

---

# 🧪 Validando o Sistema

## Frontend

```txt
http://localhost:3000
```

---

## Backend / Swagger

```txt
http://localhost:5000/swagger
```

---

# 📋 Logs e Debug

Para visualizar logs do backend em tempo real:

```bash
docker-compose logs -f backend
```

Isso ajuda a diagnosticar:

* Falhas de conexão
* Problemas SMTP
* Erros JWT
* Problemas de banco
* Exceptions da API

---

# 🧠 Boas Práticas do Projeto

* Separação clara entre frontend e backend.
* Utilização obrigatória de TypeScript no frontend.
* Nunca versionar arquivos contendo segredos.
* Utilizar sempre Senha de App para SMTP.
* Evitar hardcode de URLs, tokens e credenciais.
* Manter o `appsettings.example.json` sempre atualizado.

---

# 📌 Observações

* O backend roda em ASP.NET Core 9.
* O banco utilizado é PostgreSQL 15.
* O ambiente Docker é o método recomendado para desenvolvimento local.
* O Swagger já vem habilitado para facilitar testes da API.

---

# 👥 Colaboração em Equipe

Para compartilhar o projeto com outros desenvolvedores:

1. Compartilhe apenas arquivos de exemplo.
2. Cada integrante deve criar seu próprio:

   * `appsettings.json`
   * `.env` (caso utilize)
3. A chave JWT pode ser compartilhada entre membros da equipe quando necessário para manter compatibilidade de autenticação.

---

# 📸 Créditos e Atribuições

* **Imagem de Capa Padrão e Fundo:** [Imagem de freepik](https://br.freepik.com/imagem-ia-gratis/paisagem-de-praia-do-havai-com-natureza-e-litoral_299824859.htm)

---

# ✅ Ambiente Pronto

Após finalizar as etapas acima, o sistema estará pronto para desenvolvimento e testes locais.
