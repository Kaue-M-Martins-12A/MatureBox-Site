# MatureBox-Site

## Estrutura

```
frontend/            Site (HTML, CSS, JS e imagens)
  css/
  js/                api.js (endereço do backend), login.js, cadastro.js, ...
  imagem/
app.js               App Express com as rotas (/api/create-user e /api/login)
server.js            Servidor local (porta 3333) - também serve o frontend
config/database.js   Conexão com o MySQL (dados vêm do .env)
routes/usuarios.js   Rotas de usuários
database/schema.sql  Estrutura da tabela usuarios
```

## Como rodar localmente

1. Copie `.env.example` para `.env` e preencha os dados do banco.
2. Rode:

```
npm install
npm run dev
```

3. Acesse http://localhost:3333 (o Live Server também funciona, desde que o backend esteja rodando).

## Deploy na Vercel

São dois projetos na Vercel, ambos importando este mesmo repositório.

**Backend**
1. Root Directory: raiz do repositório (padrão). A Vercel detecta o Express pelo `app.js`.
2. Em **Settings > Environment Variables**, cadastre `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.
3. O servidor MySQL precisa aceitar conexões vindas da internet.

**Frontend**
1. Root Directory: `frontend`. Framework Preset: Other, sem comando de build.
2. Depois do deploy do backend, coloque a URL dele em `API_URL_PRODUCAO` no arquivo `frontend/js/api.js`.
