# Boilerplate Prisma + TypeScript + Express

Um boilerplate completo para desenvolvimento de APIs REST com Prisma, TypeScript e Express, incluindo suporte a cookies e estrutura modular.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web para Node.js
- **Prisma** - ORM moderno para TypeScript/JavaScript
- **SQLite** - Banco de dados (configurável)
- **JWT** - Autenticação via JSON Web Tokens
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de schemas
- **Cookie Parser** - Suporte a cookies seguros

## 📁 Estrutura do Projeto

```
├── src/
│   ├── controllers/     # Controladores da aplicação
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição das rotas
│   ├── middleware/      # Middlewares customizados
│   ├── types/           # Tipos TypeScript e schemas Zod
│   ├── utils/           # Utilitários e helpers
│   └── server.ts        # Arquivo principal do servidor
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
├── .env                 # Variáveis de ambiente
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd boilerplate-prisma-ts
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações.

4. **Configure o banco de dados**
```bash
npm run db:generate
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor compilado
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre o Prisma Studio

## 🔐 Autenticação

O projeto inclui um sistema completo de autenticação com:

- Registro de usuários
- Login/Logout
- JWT tokens
- Cookies seguros e assinados
- Middleware de autenticação
- Proteção de rotas

### Endpoints de Autenticação

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `GET /api/auth/profile` - Obter perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil
- `GET /api/auth/check` - Verificar autenticação

## 📊 API Endpoints

### Usuários
- `GET /api/users` - Listar usuários (paginado)
- `GET /api/users/:id` - Obter usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Posts
- `GET /api/posts` - Listar posts públicos (paginado)
- `GET /api/posts/:id` - Obter post por ID
- `GET /api/posts/my/posts` - Listar posts do usuário autenticado
- `POST /api/posts` - Criar post
- `PUT /api/posts/:id` - Atualizar post
- `DELETE /api/posts/:id` - Deletar post

## 🍪 Suporte a Cookies

O servidor está configurado com suporte completo a cookies:

- Cookies HTTP-only para segurança
- Cookies assinados para integridade
- Configuração automática para desenvolvimento/produção
- Proteção CSRF com SameSite

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Configuração de origem cruzada
- **Rate Limiting** - Proteção contra spam
- **Validação de dados** - Schemas Zod
- **Hash de senhas** - Bcrypt com salt
- **JWT seguros** - Tokens com expiração

## 🗄️ Banco de Dados

O projeto usa SQLite por padrão, mas pode ser facilmente configurado para:

- PostgreSQL
- MySQL
- SQL Server
- MongoDB (via Prisma)

Para alterar o banco, edite o arquivo `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql" // ou mysql, sqlserver, etc.
  url      = env("DATABASE_URL")
}
```

## 🚀 Deploy

1. **Build do projeto**
```bash
npm run build
```

2. **Configure as variáveis de ambiente de produção**

3. **Execute as migrações**
```bash
npm run db:migrate
```

4. **Inicie o servidor**
```bash
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando TypeScript + Prisma + Express**