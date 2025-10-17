# Guia de Deploy - Sertão Pet API

## Pré-requisitos no Servidor

1. **Node.js** (versão 18 ou superior)
2. **PM2** instalado globalmente
3. **PostgreSQL** configurado
4. **Git** para clone do repositório

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 --version
```

## Passos para Deploy

### 1. Clone e Configuração

```bash
# Clone o repositório
git clone <seu-repositorio> sertao-pet-api
cd sertao-pet-api

# Instalar dependências
npm install

# Copiar e configurar variáveis de ambiente
cp .env.production .env
# Edite o arquivo .env com suas configurações reais
```

### 2. Build da Aplicação

```bash
# Compilar TypeScript
npm run build

# Executar migrações do banco (se necessário)
npx prisma migrate deploy
npx prisma generate
```

### 3. Configurar Logs

```bash
# Criar diretório de logs
mkdir logs
```

### 4. Iniciar com PM2

```bash
# Iniciar aplicação
pm2 start ecosystem.config.js --env production

# Verificar status
pm2 status

# Ver logs
pm2 logs sertao-pet-api

# Monitorar
pm2 monit
```

## Comandos Úteis do PM2

```bash
# Parar aplicação
pm2 stop sertao-pet-api

# Reiniciar aplicação
pm2 restart sertao-pet-api

# Recarregar (zero downtime)
pm2 reload sertao-pet-api

# Deletar processo
pm2 delete sertao-pet-api

# Salvar configuração atual
pm2 save

# Configurar inicialização automática
pm2 startup
pm2 save
```

## Atualizações

```bash
# Parar aplicação
pm2 stop sertao-pet-api

# Atualizar código
git pull origin main

# Reinstalar dependências (se necessário)
npm install

# Rebuild
npm run build

# Executar migrações (se houver)
npx prisma migrate deploy

# Reiniciar
pm2 restart sertao-pet-api
```

## Monitoramento

```bash
# Ver logs em tempo real
pm2 logs sertao-pet-api --lines 100

# Monitorar recursos
pm2 monit

# Status detalhado
pm2 show sertao-pet-api
```

## Configurações de Segurança

1. **Firewall**: Libere apenas as portas necessárias
2. **SSL/TLS**: Configure HTTPS com certificado
3. **Reverse Proxy**: Use Nginx como proxy reverso
4. **Backup**: Configure backup automático do banco
5. **Logs**: Configure rotação de logs

## Exemplo de Configuração Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Aplicação não inicia
```bash
# Verificar logs de erro
pm2 logs sertao-pet-api --err

# Verificar configurações
pm2 show sertao-pet-api
```

### Alto uso de memória
```bash
# Verificar uso de recursos
pm2 monit

# Reiniciar se necessário
pm2 restart sertao-pet-api
```

### Banco de dados
```bash
# Testar conexão
npx prisma db pull

# Verificar migrações
npx prisma migrate status
```