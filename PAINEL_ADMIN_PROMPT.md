# Prompt para Desenvolvimento do Painel Administrativo - Sertão Pet

## Contexto do Projeto

Você deve criar um **painel administrativo completo** para o sistema Sertão Pet, uma plataforma de proteção animal que conecta pessoas para adoção, denúncias, doações e gestão de casos de resgate. O painel será usado pelo **dono do negócio** para gerenciar toda a operação.

## Estrutura do Banco de Dados (Schema Prisma)

O sistema possui as seguintes entidades principais:

### 👥 **Usuários e Autenticação**
- **Users**: Usuários com roles (USER, VOLUNTEER, ADMIN)
- **UserBadge**: Sistema de gamificação com badges
- **Verification**: Sistema de verificação de usuários

### 🐕 **Gestão de Animais**
- **Pet**: Animais cadastrados (cães, gatos, outros)
- **PetImage**: Imagens dos animais
- **Species**: CAO, GATO, OUTROS
- **PetStatus**: SAUDAVEL, FILHOTE, FERIDO, AGRESSIVO

### 🏠 **Sistema de Adoção**
- **AdoptionInterest**: Interesse em adoção
- **AdoptionProcess**: Processos de adoção (PENDING, APPROVED, REJECTED, COMPLETED)
- **TemporaryHome**: Lares temporários

### 📢 **Sistema de Denúncias**
- **Report**: Denúncias (ABANDONO, FERIDO, AGRESSIVO, PERDIDO)
- **ReportImage**: Imagens das denúncias
- **ReportStatus**: PENDENTE, EM_ANDAMENTO, RESOLVIDO
- **UrgencyLevel**: BAIXA, MEDIA, ALTA

### 💰 **Sistema de Doações**
- **Donation**: Doações com diferentes propósitos
- **DonationGoal**: Metas de arrecadação
- **DonationPurpose**: GERAL, RACAO, MEDICAMENTOS, CASTRACAO, VETERINARIO
- **PaymentMethod**: PIX, CARTAO, TRANSFERENCIA

### 🏢 **Organizações**
- **Organization**: ONGs e organizações parceiras
- **UserOrganization**: Membros das organizações
- **OrgRole**: MEMBER, COORDINATOR, ADMIN

### 📋 **Gestão de Casos**
- **Case**: Casos de resgate e proteção
- **Task**: Tarefas relacionadas aos casos
- **CaseStatus**: OPEN, IN_PROGRESS, RESOLVED, CLOSED
- **CasePriority**: BAIXA, MEDIA, ALTA, CRITICA

### 📱 **Sistema Social**
- **Post**: Posts da comunidade
- **Comment**: Comentários
- **Reaction**: Reações (LIKE, SUPPORT, LOVE, CELEBRATE)
- **Follow**: Sistema de seguir usuários

### 💬 **Mensageria**
- **Conversation**: Conversas
- **Message**: Mensagens
- **ConversationParticipant**: Participantes das conversas

### 🎯 **Gamificação**
- **ActivityLog**: Log de atividades dos usuários
- **ActivityType**: Tipos de atividades que geram pontos

## Funcionalidades Obrigatórias do Painel

### 📊 **Dashboard Principal**
- **KPIs em tempo real**:
  - Total de animais cadastrados
  - Adoções realizadas (mês/ano)
  - Denúncias pendentes por urgência
  - Doações arrecadadas (mês/ano)
  - Usuários ativos
  - Casos em andamento por prioridade
- **Gráficos**:
  - Evolução de adoções por mês
  - Distribuição de denúncias por tipo
  - Metas de doação vs arrecadado
  - Mapa de calor de denúncias por região

### 🐕 **Gestão de Animais**
- **CRUD completo** de pets
- **Upload múltiplo** de imagens
- **Filtros avançados**: espécie, status, localização, disponibilidade
- **Geolocalização** no mapa
- **Histórico** de cada animal (denúncias, adoções, lares temporários)
- **Status de saúde** e acompanhamento veterinário

### 👥 **Gestão de Usuários**
- **Lista paginada** com filtros por role, status, pontuação
- **Sistema de verificação** de usuários
- **Gestão de badges** e gamificação
- **Histórico de atividades** por usuário
- **Bloqueio/desbloqueio** de contas
- **Relatório de engajamento**

### 📢 **Gestão de Denúncias**
- **Dashboard de denúncias** por status e urgência
- **Mapa interativo** com pins das denúncias
- **Workflow de aprovação**: Pendente → Em Andamento → Resolvido
- **Atribuição** de denúncias para voluntários/organizações
- **Timeline** de ações tomadas
- **Geração de casos** a partir de denúncias

### 🏠 **Gestão de Adoções**
- **Pipeline de adoção**: Interesse → Processo → Aprovação → Conclusão
- **Formulários de avaliação** dos adotantes
- **Acompanhamento pós-adoção**
- **Relatórios de sucesso** de adoções
- **Integração** com sistema de mensageria

### 💰 **Gestão Financeira**
- **Dashboard financeiro** com receitas e metas
- **Gestão de metas** de arrecadação
- **Relatórios detalhados** por período e propósito
- **Integração** com gateways de pagamento
- **Controle de gastos** e prestação de contas
- **Exportação** para Excel/PDF

### 🏢 **Gestão de Organizações**
- **CRUD de organizações** parceiras
- **Gestão de membros** e permissões
- **Atribuição de casos** para organizações
- **Relatórios de performance** por organização
- **Sistema de verificação** de ONGs

### 📋 **Gestão de Casos**
- **Kanban board** para casos (Aberto → Em Progresso → Resolvido)
- **Atribuição** de casos para equipes
- **Sistema de tarefas** com prazos e responsáveis
- **SLA tracking** e alertas de vencimento
- **Anexos** e documentação
- **Timeline** de ações

### 📱 **Moderação de Conteúdo**
- **Moderação de posts** da comunidade
- **Sistema de denúncias** de conteúdo
- **Gestão de comentários** e reações
- **Bloqueio** de conteúdo inadequado

### 📊 **Relatórios e Analytics**
- **Relatórios customizáveis** por período
- **Exportação** em múltiplos formatos
- **Analytics de engajamento** da comunidade
- **Métricas de conversão** (interesse → adoção)
- **ROI** de campanhas de doação

### ⚙️ **Configurações do Sistema**
- **Gestão de permissões** por role
- **Configurações de notificações**
- **Parâmetros do sistema** (pontuação, badges)
- **Backup** e restore de dados
- **Logs de auditoria**

## Especificações Técnicas

### 🎨 **Design e UX**
- **Interface moderna** e responsiva
- **Dark/Light mode**
- **Componentes reutilizáveis**
- **Navegação intuitiva** com breadcrumbs
- **Loading states** e feedback visual
- **Acessibilidade** (WCAG 2.1)

### 🔧 **Tecnologias Sugeridas**
- **Frontend**: React/Next.js + TypeScript
- **UI Library**: Ant Design, Material-UI ou Chakra UI
- **Charts**: Chart.js, Recharts ou D3.js
- **Maps**: Google Maps ou Mapbox
- **State Management**: Redux Toolkit ou Zustand
- **Forms**: React Hook Form + Zod

### 🔐 **Segurança**
- **Autenticação JWT** com refresh tokens
- **Autorização baseada em roles**
- **Rate limiting** nas APIs
- **Validação** de inputs
- **Sanitização** de dados
- **Logs de auditoria**

### 📱 **Responsividade**
- **Mobile-first** approach
- **Breakpoints** bem definidos
- **Touch-friendly** interfaces
- **Progressive Web App** (PWA)

## Entregáveis Esperados

1. **Código fonte completo** do painel administrativo
2. **Documentação técnica** de instalação e uso
3. **Guia do usuário** com screenshots
4. **Scripts de deploy** e configuração
5. **Testes unitários** das principais funcionalidades
6. **Docker** setup para desenvolvimento

## Critérios de Qualidade

- **Performance**: Carregamento < 3s
- **Usabilidade**: Interface intuitiva e acessível
- **Escalabilidade**: Suporte a milhares de registros
- **Manutenibilidade**: Código limpo e documentado
- **Segurança**: Proteção contra vulnerabilidades comuns
- **Compatibilidade**: Suporte aos principais navegadores

## Observações Importantes

- O painel deve ser **100% funcional** com todas as operações CRUD
- Implementar **validações robustas** tanto no frontend quanto backend
- Considerar **performance** para grandes volumes de dados
- Incluir **sistema de notificações** em tempo real
- Prever **integração** com APIs externas (pagamento, mapas, etc.)
- Documentar **todas as APIs** utilizadas

---

**Meta**: Criar um painel administrativo profissional que permita ao dono do negócio ter controle total sobre a plataforma Sertão Pet, com foco em usabilidade, performance e escalabilidade.