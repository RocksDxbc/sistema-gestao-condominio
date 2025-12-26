# 🚀 Guia Rápido de Instalação

## 📋 Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Git

## ⚡ Instalação Rápida

### 1️⃣ Backend

```bash
# Criar e entrar na pasta do projeto
mkdir sistema-condominio && cd sistema-condominio
mkdir backend && cd backend

# Inicializar projeto
npm init -y

# Instalar todas as dependências de uma vez
npm install express cors dotenv bcryptjs jsonwebtoken multer @prisma/client prisma swagger-jsdoc swagger-ui-express

npm install --save-dev typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken @types/multer @types/swagger-jsdoc @types/swagger-ui-express ts-node-dev

# Inicializar TypeScript e Prisma
npx tsc --init
npx prisma init

# Criar pasta de uploads
mkdir uploads
```

**Configurar `.env`:**
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/condominio_db"
JWT_SECRET="chave_secreta_super_segura_123456"
PORT=3001
NODE_ENV=development
```

**Copiar arquivos criados anteriormente:**
- `prisma/schema.prisma`
- `src/server.ts`
- `src/swagger.ts`
- `src/middleware/auth.middleware.ts`
- `src/routes/*.ts`
- `tsconfig.json`
- `package.json` (atualizar scripts)

**No package.json, adicionar:**
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Executar:**
```bash
# Gerar Prisma Client
npx prisma generate

# Criar banco de dados
npx prisma migrate dev --name init

# Popular com dados iniciais
npx prisma db seed

# Iniciar servidor
npm run dev
```

### 2️⃣ Frontend

```bash
# Voltar para raiz
cd ..

# Criar React App
npx create-react-app frontend --template typescript
cd frontend

# Instalar dependências
npm install axios react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer @types/react-router-dom

# Inicializar Tailwind
npx tailwindcss init -p
```

**Copiar arquivos:**
- `src/App.tsx`
- `src/contexts/AuthContext.tsx`
- `src/services/api.ts`
- `src/pages/*.tsx`
- `src/index.css`
- `tailwind.config.js`

**Criar `.env`:**
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Atualizar `src/index.tsx`:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Iniciar:**
```bash
npm start
```

## ✅ Verificar Instalação

1. Backend: http://localhost:3001
2. API Docs: http://localhost:3001/api-docs
3. Frontend: http://localhost:3000

## 🔑 Credenciais de Teste

**Admin:**
- Email: admin@condominio.com
- Senha: admin123

**Porteiro:**
- Email: porteiro@condominio.com
- Senha: porteiro123

**Morador:**
- Email: morador1@teste.com
- Senha: morador123

## 📱 Testar em Outros Dispositivos

1. Descobrir seu IP:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig`

2. Acessar de outros dispositivos na mesma rede:
   - Backend: `http://SEU_IP:3001` - 192.168.0.245
   - Frontend: `http://SEU_IP:3000` - 192.168.0.245 - http://192.168.0.245:3000

## 🐛 Problemas Comuns

**Erro de conexão com PostgreSQL:**
```bash
# Verificar se PostgreSQL está rodando
# Windows: Services
# Linux: sudo systemctl status postgresql
# Mac: brew services list
```

**Porta em uso:**
```bash
# Backend - mudar PORT no .env
# Frontend - usar: PORT=3002 npm start
```

**Prisma não encontrado:**
```bash
npx prisma generate
npx prisma migrate dev
```

## 📚 Recursos

- Documentação Swagger: http://localhost:3001/api-docs
- Prisma Studio: `npx prisma studio`
- Logs do Backend: Terminal onde `npm run dev` está rodando
- Console Frontend: F12 no navegador