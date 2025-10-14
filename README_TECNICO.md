# 📋 Documentação Técnica - API Sertão Pet

## 🎯 Visão Geral

A **API Sertão Pet** é uma plataforma completa para gerenciamento de proteção animal, desenvolvida com foco na região do sertão. A aplicação oferece funcionalidades abrangentes para ONGs, protetores independentes e cidadãos interessados em contribuir com a causa animal.

## 🏗️ Arquitetura Técnica

### Stack Tecnológica

- **Runtime**: Node.js
- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod
- **Upload de Arquivos**: Multer
- **Comunicação em Tempo Real**: Socket.IO
- **Segurança**: Helmet, CORS, bcryptjs

### Estrutura do Projeto

```
src/
├── core/                    # Configurações centrais
│   ├── libs/               # Bibliotecas auxiliares
│   ├── middleware/         # Middlewares globais
│   └── socket.ts          # Configuração WebSocket
├── modules/               # Módulos funcionais
│   ├── adoption/          # Sistema de adoção
│   ├── attachments/       # Gerenciamento de arquivos
│   ├── auth/             # Autenticação e autorização
│   ├── badge/            # Sistema de gamificação
│   ├── cases/            # Gestão de casos
│   ├── chat/             # Sistema de mensagens
│   ├── comments/         # Comentários em posts
│   ├── donations/        # Sistema de doações
│   ├── organizations/    # Gestão de ONGs
│   ├── pets/            # Cadastro de animais
│   ├── posts/           # Rede social
│   ├── reaction/        # Reações em posts
│   ├── reports/         # Sistema de denúncias
│   ├── temporaryHome/   # Lares temporários
│   └── users/           # Gestão de usuários
├── prisma/              # Cliente Prisma
├── types/               # Definições de tipos
├── utils/               # Utilitários
└── server.ts           # Servidor principal
```

## 📊 Modelo de Dados

### Entidades Principais

#### 👤 **Usuários (Users)**
- Perfis diferenciados: USER, VOLUNTEER, ADMIN
- Sistema de pontuação para gamificação
- Verificação de identidade
- Relacionamentos sociais (seguir/seguidores)

#### 🐕 **Pets**
- Espécies: Cão, Gato, Outros
- Status: Saudável, Filhote, Ferido, Agressivo
- Geolocalização (latitude/longitude)
- Múltiplas imagens por animal
- Histórico de adoções

#### 🏢 **Organizações**
- Gestão hierárquica de membros
- Verificação oficial
- Casos associados
- Eventos e campanhas

#### 📋 **Casos (Cases)**
- Priorização automática
- SLA (Service Level Agreement)
- Tarefas associadas
- Geolocalização
- Anexos e documentação

#### 🚨 **Denúncias (Reports)**
- **NOVO**: Suporte a múltiplas fotos
- Tipos: Abandono, Ferido, Agressivo, Perdido
- Níveis de urgência
- Geolocalização
- Rastreamento de status

## 🔧 Funcionalidades Implementadas

### 🔐 **Autenticação e Autorização**
- Login/logout com JWT
- Middleware de autenticação
- Controle de acesso baseado em roles
- Gestão de perfis de usuário

### 🐾 **Gestão de Animais**
- CRUD completo de pets
- Upload múltiplo de imagens
- Filtros avançados de busca
- Geolocalização de animais

### 🤝 **Sistema de Adoção**
- Manifestação de interesse
- Processo de aprovação
- Acompanhamento de status
- Histórico de adoções

### 🚨 **Sistema de Denúncias** ⭐ *Recém Atualizado*
- **Múltiplas fotos por denúncia**
- Categorização por tipo e urgência
- Geolocalização automática
- Workflow de resolução
- API RESTful completa

### 🏢 **Gestão Organizacional**
- Criação e administração de ONGs
- Sistema de membros com roles
- Verificação oficial
- Gestão de casos organizacionais

### 📋 **Gestão de Casos**
- Criação de casos por organizações
- Sistema de tarefas
- Priorização e SLA
- Anexos e documentação
- Rastreamento de progresso

### 💰 **Sistema de Doações**
- Múltiplos métodos de pagamento
- Metas de arrecadação
- Finalidades específicas
- Histórico de transações

### 🏠 **Lares Temporários**
- Cadastro de cuidadores temporários
- Associação pet-cuidador
- Controle de períodos
- Status de atividade

### 🎮 **Gamificação**
- Sistema de pontos por ações
- Badges e conquistas
- Log de atividades
- Ranking de usuários

### 📱 **Rede Social**
- Posts com conteúdo rico
- Sistema de comentários
- Reações (Like, Support, Love, Celebrate)
- Seguir usuários
- Feed personalizado

### 💬 **Sistema de Chat**
- Conversas em tempo real
- WebSocket com Socket.IO
- Anexos em mensagens
- Notificações

### 📎 **Gestão de Arquivos**
- Upload seguro com Multer
- Múltiplos formatos suportados
- Associação flexível a entidades
- Controle de acesso

## 🔌 API Endpoints

### Principais Rotas

```
POST   /auth/login              # Autenticação
GET    /auth/profile            # Perfil do usuário
PUT    /auth/profile            # Atualizar perfil

GET    /pets                    # Listar pets
POST   /pets                    # Cadastrar pet
GET    /pets/:id                # Buscar pet
PUT    /pets/:id                # Atualizar pet
DELETE /pets/:id                # Remover pet

POST   /reports                 # Criar denúncia (com múltiplas fotos)
GET    /reports                 # Listar denúncias
GET    /reports/:id             # Buscar denúncia
PUT    /reports/:id             # Atualizar denúncia
DELETE /reports/:id             # Remover denúncia

GET    /organizations           # Listar organizações
POST   /organizations           # Criar organização
GET    /organizations/:id       # Buscar organização
PUT    /organizations/:id       # Atualizar organização
POST   /organizations/:id/members # Adicionar membro

GET    /cases/:id               # Buscar caso
PUT    /cases/:id               # Atualizar caso
POST   /cases/:id/tasks         # Criar tarefa
GET    /cases/:id/tasks         # Listar tarefas

POST   /posts                   # Criar post
GET    /posts                   # Listar posts
GET    /posts/:id               # Buscar post

POST   /attachments             # Upload de arquivos
GET    /attachments             # Listar arquivos
DELETE /attachments/:id         # Remover arquivo
```

## 🛡️ Segurança

### Medidas Implementadas

- **Autenticação JWT**: Tokens seguros com expiração
- **Bcrypt**: Hash de senhas com salt
- **Helmet**: Headers de segurança HTTP
- **CORS**: Controle de origem cruzada
- **Validação Zod**: Sanitização de entrada
- **Middleware de Autorização**: Controle de acesso por role

### Controle de Acesso

- **USER**: Operações básicas (pets, denúncias, adoções)
- **VOLUNTEER**: Funcionalidades de voluntário + USER
- **ADMIN**: Acesso completo ao sistema

## 📈 Performance e Escalabilidade

### Otimizações

- **Paginação**: Implementada em todas as listagens
- **Índices de Banco**: Otimização de consultas frequentes
- **Relacionamentos Lazy**: Carregamento sob demanda
- **Validação de Schema**: Zod para performance de validação
- **Middleware de Cache**: Headers apropriados

### Monitoramento

- **Logs Estruturados**: Sistema de logging
- **Error Handling**: Tratamento centralizado de erros
- **Health Checks**: Endpoints de saúde da aplicação

## 🚀 Deploy e Configuração

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
```

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Iniciar aplicação
npm run db:migrate   # Executar migrações
npm run db:studio    # Interface visual do banco
npm run db:seed      # Popular banco com dados iniciais
```

## 🔄 Próximas Implementações

### Roadmap Técnico

1. **Cache Redis**: Implementação de cache distribuído
2. **Rate Limiting**: Controle de taxa de requisições
3. **Logs Centralizados**: ELK Stack ou similar
4. **Testes Automatizados**: Jest + Supertest
5. **CI/CD Pipeline**: GitHub Actions
6. **Documentação OpenAPI**: Swagger/OpenAPI 3.0
7. **Métricas**: Prometheus + Grafana
8. **Backup Automatizado**: Estratégia de backup do banco

### Melhorias de Performance

1. **Connection Pooling**: Otimização de conexões DB
2. **Query Optimization**: Análise e otimização de queries
3. **CDN**: Para arquivos estáticos
4. **Compressão**: Gzip/Brotli
5. **Clustering**: Múltiplas instâncias da aplicação

## 📚 Documentação Adicional

- **Prisma Schema**: Definições completas em `prisma/schema.prisma`
- **Types**: Definições TypeScript em `src/types/`
- **DTOs**: Validações Zod em cada módulo
- **Middleware**: Configurações em `src/core/middleware/`

---

**Desenvolvido com ❤️ para a proteção animal no sertão**