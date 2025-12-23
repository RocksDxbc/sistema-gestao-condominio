# ⚡ Git - Comandos Rápidos (Copy & Paste)

## 🎯 Configuração Inicial (Fazer UMA vez)

### 1. Configurar Git

```bash
# Configure com SEU nome e email
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu.email@exemplo.com"

# Branch padrão
git config --global init.defaultBranch main

# Editor
git config --global core.editor "code --wait"

# Colorir output
git config --global color.ui auto

# Aliases úteis
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Verificar configurações
git config --list
```

---

## 📁 Inicializar Projeto

### 2. Criar .gitignore Raiz

**Na pasta `sistema-condominio/` criar arquivo `.gitignore`:**

```gitignore
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*

# Ambiente
.env
.env.local
.env.production
*.env

# Uploads (manter pasta, ignorar arquivos)
backend/uploads/*.jpg
backend/uploads/*.png
backend/uploads/*.jpeg
backend/uploads/*.gif
!backend/uploads/.gitkeep

# Build
dist/
dist-ssr/
build/
backend/dist/

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Banco
*.db
*.sqlite

# Prisma
backend/prisma/migrations/
```

### 3. Manter Pasta uploads/

```bash
# Criar .gitkeep
touch backend/uploads/.gitkeep

# Ou no Windows
type nul > backend\uploads\.gitkeep
```

### 4. Inicializar Git

```bash
# Ir para raiz do projeto
cd sistema-condominio

# Inicializar
git init

# Verificar status
git status
```

### 5. Primeiro Commit

```bash
# Adicionar todos arquivos
git add .

# Commit inicial
git commit -m "Initial commit: Sistema de Gestão de Condomínio

- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Frontend: Vite + React + TypeScript + UnoCSS
- Features: Autenticação JWT, Gestão de Encomendas, Notificações
- Documentação: README, Manual de Instalação, Swagger"

# Verificar
git log
```

---

## 🌐 Conectar com GitHub

### 6. Criar Repositório no GitHub

1. Acesse: https://github.com
2. Click **+** → **New repository**
3. Nome: `sistema-gestao-condominio`
4. Description: `Sistema completo de gestão de condomínio`
5. **Public** ou **Private**
6. **NÃO** marcar nada (README, .gitignore, license)
7. **Create repository**

### 7. Adicionar Remote (Escolha SSH ou HTTPS)

**OPÇÃO A: SSH (Recomendado - mais seguro)**

```bash
# Adicionar remote
git remote add origin git@github.com:SEU_USUARIO/sistema-gestao-condominio.git

# Verificar
git remote -v
```

**OPÇÃO B: HTTPS (com Token)**

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/sistema-gestao-condominio.git

# Verificar
git remote -v
```

### 8. Enviar para GitHub

```bash
# Garantir que está na branch main
git branch -M main

# Enviar código
git push -u origin main
```

**Se usar HTTPS:**
- Username: `seu_usuario_github`
- Password: `cole_seu_token_aqui` (NÃO é a senha da conta!)

---

## 🔑 Configurar SSH (Recomendado)

### 9. Gerar Chave SSH

```bash
# Gerar chave (substitua pelo SEU email do GitHub)
ssh-keygen -t ed25519 -C "seu.email@exemplo.com"

# Pressione Enter 3x (aceitar padrões)
```

### 10. Copiar Chave Pública

```bash
# Linux/Mac
cat ~/.ssh/id_ed25519.pub

# Windows (PowerShell)
type $env:USERPROFILE\.ssh\id_ed25519.pub

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub
```

### 11. Adicionar no GitHub

1. GitHub → **Settings**
2. **SSH and GPG keys**
3. **New SSH key**
4. Title: `Meu Computador`
5. Key: **Cole a chave copiada**
6. **Add SSH key**

### 12. Testar Conexão

```bash
ssh -T git@github.com

# Deve mostrar:
# Hi username! You've successfully authenticated
```

---

## 💼 Workflow Diário

### Começar o Dia

```bash
# Baixar últimas alterações
git pull origin main

# Criar nova branch para feature
git checkout -b feature/nome-da-feature
```

### Durante Desenvolvimento

```bash
# Ver status
git status

# Ver diferenças
git diff

# Adicionar arquivos
git add .

# Ou adicionar específico
git add src/pages/NovaFeature.tsx

# Commitar
git commit -m "feat: adiciona nova funcionalidade"
```

### Finalizar Feature

```bash
# Voltar para main
git checkout main

# Atualizar main
git pull origin main

# Fazer merge da feature
git merge feature/nome-da-feature

# Enviar para GitHub
git push origin main

# Deletar branch local (opcional)
git branch -d feature/nome-da-feature
```

---

## 📝 Commits Semânticos

```bash
# Nova funcionalidade
git commit -m "feat: adiciona registro de visitantes"

# Correção de bug
git commit -m "fix: corrige erro no login"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Estilo/formatação
git commit -m "style: formata código do backend"

# Refatoração
git commit -m "refactor: reorganiza estrutura de pastas"

# Testes
git commit -m "test: adiciona testes para AuthContext"

# Manutenção
git commit -m "chore: atualiza dependências"
```

---

## 🔧 Comandos Úteis

### Ver Histórico

```bash
# Histórico completo
git log

# Histórico resumido
git log --oneline

# Últimos 5 commits
git log -5

# Histórico gráfico
git log --oneline --graph --all
```

### Branches

```bash
# Listar branches
git branch

# Criar branch
git branch feature/nova

# Mudar para branch
git checkout feature/nova

# Criar e mudar (atalho)
git checkout -b feature/nova

# Deletar branch
git branch -d feature/antiga

# Deletar branch remota
git push origin --delete feature/antiga
```

### Desfazer Alterações

```bash
# Desfazer modificação em arquivo (antes do add)
git checkout -- arquivo.txt

# Remover do staging (após git add)
git reset HEAD arquivo.txt

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1
```

### Atualizar

```bash
# Baixar e aplicar alterações
git pull origin main

# Apenas baixar (sem aplicar)
git fetch origin

# Enviar alterações
git push origin main

# Forçar envio (cuidado!)
git push -f origin main
```

---

## 🆘 Resolver Problemas Comuns

### Erro: "failed to push some refs"

```bash
# Baixar alterações primeiro
git pull origin main

# Resolver conflitos se houver
# Então enviar
git push origin main
```

### Commitou arquivo sensível (.env)

```bash
# Remover do Git (manter local)
git rm --cached .env

# Adicionar ao .gitignore
echo ".env" >> .gitignore

# Commitar
git add .gitignore
git commit -m "chore: remove .env do controle de versão"

# Enviar
git push origin main

# IMPORTANTE: Trocar senhas/tokens expostos!
```

### Remover remote incorreto

```bash
# Ver remotes
git remote -v

# Remover
git remote remove origin

# Adicionar correto
git remote add origin git@github.com:USUARIO_CORRETO/repo.git
```

### Conflitos no merge

```bash
# 1. Ver arquivos com conflito
git status

# 2. Abrir arquivo e editar manualmente
# Procurar por <<<<<<< HEAD

# 3. Após resolver
git add arquivo-resolvido.txt

# 4. Finalizar merge
git commit -m "merge: resolve conflitos"
```

---

## 📋 Checklist Rápido

### Setup Inicial:
- [ ] Git instalado
- [ ] Configurado nome e email
- [ ] SSH ou Token configurado
- [ ] .gitignore criado
- [ ] git init
- [ ] Primeiro commit
- [ ] Repositório GitHub criado
- [ ] Remote adicionado
- [ ] git push

### Diariamente:
- [ ] git pull
- [ ] Criar branch para feature
- [ ] Commitar frequentemente
- [ ] Mensagens descritivas
- [ ] Merge na main
- [ ] git push

---

## 🎯 Templates Prontos

### .gitignore Completo

```gitignore
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
package-lock.json
yarn.lock

# Ambiente
.env
.env.local
.env.development
.env.production
*.env

# Uploads
backend/uploads/*
!backend/uploads/.gitkeep

# Build
dist/
dist-ssr/
build/
backend/dist/
frontend/dist/

# Logs
logs/
*.log

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE
.vscode/
!.vscode/extensions.json
.idea/
*.swp
*.swo
*.swn
*~

# Teste
coverage/
.nyc_output/

# Banco
*.db
*.sqlite
*.sqlite3

# Prisma
backend/prisma/migrations/
backend/node_modules/.prisma/

# Temporários
*.tmp
*.temp
.cache/
```

### README.md Template

```markdown
# Sistema de Gestão de Condomínio

Sistema completo para gestão de condomínios residenciais.

## 🚀 Tecnologias

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma
- JWT Authentication
- Swagger Docs

### Frontend
- Vite + React
- TypeScript
- UnoCSS
- React Router

## 📦 Instalação

Ver [MANUAL_INSTALACAO.md](MANUAL_INSTALACAO.md)

## 🔑 Credenciais de Teste

**Admin:**
- Email: admin@condominio.com
- Senha: admin123

**Morador:**
- Email: morador1@teste.com
- Senha: morador123

## 📝 License

MIT
```

---

## 🎉 Pronto!

Agora você tem todos os comandos prontos para:

✅ Configurar Git  
✅ Conectar com GitHub  
✅ Gerenciar seu código  
✅ Trabalhar em equipe  

**Basta copiar e colar! 🚀**