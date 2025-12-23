# 🚀 Manual Completo - Git e GitHub

## 📋 Índice

1. [Instalação do Git](#1-instalação-do-git)
2. [Configuração Inicial](#2-configuração-inicial)
3. [Criar Conta no GitHub](#3-criar-conta-no-github)
4. [Inicializar Git no Projeto](#4-inicializar-git-no-projeto)
5. [Conectar com GitHub](#5-conectar-com-github)
6. [Comandos Essenciais](#6-comandos-essenciais)
7. [Workflow Diário](#7-workflow-diário)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Instalação do Git

### Windows

1. **Baixar Git:**
   - Acesse: https://git-scm.com/download/win
   - Baixe o instalador (64-bit recomendado)

2. **Instalar:**
   - Execute o instalador
   - **Recomendações:**
     - ✅ Use editor padrão: Visual Studio Code (se instalado)
     - ✅ Git from the command line and also from 3rd-party software
     - ✅ Use the OpenSSL library
     - ✅ Checkout Windows-style, commit Unix-style line endings
     - ✅ Use MinTTY
     - ✅ Default (fast-forward or merge)
     - ✅ Git Credential Manager
     - ✅ Enable file system caching

3. **Verificar Instalação:**
   ```bash
   git --version
   # Deve mostrar: git version 2.43.0 ou superior
   ```

### Linux (Ubuntu/Debian)

```bash
# Atualizar repositórios
sudo apt update

# Instalar Git
sudo apt install git -y

# Verificar
git --version
```

### macOS

```bash
# Usando Homebrew (recomendado)
brew install git

# Ou instalar Xcode Command Line Tools
xcode-select --install

# Verificar
git --version
```

---

## 2. Configuração Inicial

### 2.1. Configurar Nome e Email

```bash
# Configurar nome (será visível nos commits)
git config --global user.name "Seu Nome"

# Configurar email (use o mesmo do GitHub)
git config --global user.email "seu.email@exemplo.com"

# Verificar configurações
git config --list
```

### 2.2. Configurar Editor Padrão

```bash
# Visual Studio Code
git config --global core.editor "code --wait"

# Ou Vim
git config --global core.editor "vim"

# Ou Nano
git config --global core.editor "nano"
```

### 2.3. Configurar Branch Padrão

```bash
# Usar 'main' como branch padrão (padrão moderno)
git config --global init.defaultBranch main
```

### 2.4. Configurações Úteis

```bash
# Colorir saída do Git
git config --global color.ui auto

# Salvar credenciais (cache por 1 hora)
git config --global credential.helper cache

# Ou salvar permanentemente (Windows)
git config --global credential.helper wincred

# Aliases úteis
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
```

---

## 3. Criar Conta no GitHub

### 3.1. Criar Conta

1. Acesse: https://github.com
2. Clique em **Sign up**
3. Preencha:
   - Username (ex: joaosilva)
   - Email (use o mesmo configurado no Git)
   - Senha (forte e segura)
4. Verificar email
5. Escolher plano **Free**

### 3.2. Configurar Autenticação (Personal Access Token)

**Importante:** GitHub não aceita mais senha para Git. Use Token!

1. **Criar Token:**
   - Login no GitHub
   - Click no seu avatar (canto superior direito)
   - Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token → Generate new token (classic)

2. **Configurar Token:**
   - Note: `Token para projeto condominio`
   - Expiration: `90 days` (ou No expiration)
   - Selecionar scopes:
     - ✅ repo (todos)
     - ✅ workflow
     - ✅ admin:repo_hook
   - Gerar token

3. **COPIAR E SALVAR:**
   - ⚠️ **IMPORTANTE:** Copie o token AGORA!
   - Salve em local seguro (não compartilhe!)
   - Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3.3. Configurar SSH (Alternativa - Recomendado)

**Método mais seguro e prático:**

1. **Gerar Chave SSH:**
   ```bash
   # Gerar chave (use seu email do GitHub)
   ssh-keygen -t ed25519 -C "seu.email@exemplo.com"
   
   # Pressione Enter 3x (sem senha para facilitar)
   # Chave salva em: ~/.ssh/id_ed25519
   ```

2. **Copiar Chave Pública:**
   ```bash
   # Linux/Mac
   cat ~/.ssh/id_ed25519.pub
   
   # Windows (PowerShell)
   type C:\Users\SEU_USUARIO\.ssh\id_ed25519.pub
   
   # Windows (Git Bash)
   cat ~/.ssh/id_ed25519.pub
   ```

3. **Adicionar no GitHub:**
   - GitHub → Settings
   - SSH and GPG keys
   - New SSH key
   - Title: `Meu PC` ou `Notebook Trabalho`
   - Key: Cole a chave copiada
   - Add SSH key

4. **Testar Conexão:**
   ```bash
   ssh -T git@github.com
   # Deve mostrar: Hi username! You've successfully authenticated
   ```

---

## 4. Inicializar Git no Projeto

### 4.1. Estrutura do Projeto

```
sistema-condominio/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   └── ...
└── frontend/
    ├── src/
    └── ...
```

### 4.2. Criar .gitignore Raiz

```bash
# Na raiz do projeto (sistema-condominio/)
cd sistema-condominio
```

**Criar arquivo `.gitignore`:**

```bash
# Criar .gitignore
touch .gitignore  # Linux/Mac
type nul > .gitignore  # Windows
```

**Conteúdo do `.gitignore` raiz:**

```
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ambiente
.env
.env.local
.env.production
*.env

# Uploads
backend/uploads/*.jpg
backend/uploads/*.png
backend/uploads/*.jpeg
backend/uploads/*.gif
!backend/uploads/.gitkeep

# Build
dist/
dist-ssr/
build/

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
*~

# Banco de dados local
*.db
*.sqlite

# Prisma
backend/prisma/migrations/
```

### 4.3. Manter Pasta uploads/

```bash
# Criar .gitkeep para manter pasta vazia no Git
touch backend/uploads/.gitkeep
```

### 4.4. Inicializar Git

```bash
# Certificar que está na raiz do projeto
cd sistema-condominio

# Inicializar repositório Git
git init

# Verificar status
git status
```

**Resultado esperado:**
```
Initialized empty Git repository in .../sistema-condominio/.git/
```

### 4.5. Primeiro Commit

```bash
# Adicionar todos os arquivos
git add .

# Criar primeiro commit
git commit -m "Initial commit: Sistema de Gestão de Condomínio

- Backend: Node.js + Express + TypeScript + Prisma
- Frontend: Vite + React + TypeScript + UnoCSS
- Features: Autenticação, Encomendas, Notificações"

# Verificar histórico
git log
```

---

## 5. Conectar com GitHub

### 5.1. Criar Repositório no GitHub

1. **No GitHub:**
   - Click no **+** (canto superior direito)
   - **New repository**

2. **Configurar:**
   - Repository name: `sistema-gestao-condominio`
   - Description: `Sistema completo de gestão de condomínio com backend e frontend`
   - Visibilidade: 
     - ✅ **Public** (visível para todos)
     - ⬜ **Private** (apenas você)
   - ⬜ NÃO marcar "Initialize with README"
   - ⬜ NÃO adicionar .gitignore
   - ⬜ NÃO escolher license
   - **Create repository**

### 5.2. Conectar Repositório Local ao GitHub

**Opção A: Usando HTTPS (com Token)**

```bash
# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/sistema-gestao-condominio.git

# Verificar
git remote -v
```

**Opção B: Usando SSH (Recomendado)**

```bash
# Adicionar repositório remoto
git remote add origin git@github.com:SEU_USUARIO/sistema-gestao-condominio.git

# Verificar
git remote -v
```

### 5.3. Enviar Código para GitHub

```bash
# Renomear branch para 'main' (se necessário)
git branch -M main

# Enviar código para GitHub
git push -u origin main

# Digite suas credenciais quando solicitado:
# - Username: seu_usuario_github
# - Password: cole_seu_token_aqui (não a senha!)
```

**Resultado esperado:**
```
Enumerating objects: 100, done.
Counting objects: 100% (100/100), done.
...
To https://github.com/SEU_USUARIO/sistema-gestao-condominio.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### 5.4. Verificar no GitHub

1. Refresh a página do repositório
2. Deve aparecer todos os arquivos!
3. ✅ Sucesso!

---

## 6. Comandos Essenciais

### 6.1. Status e Informações

```bash
# Ver status dos arquivos
git status

# Ver histórico de commits
git log

# Histórico resumido
git log --oneline

# Ver diferenças não commitadas
git diff

# Ver branches
git branch

# Ver remotos configurados
git remote -v
```

### 6.2. Adicionar e Commitar

```bash
# Adicionar arquivo específico
git add arquivo.txt

# Adicionar todos arquivos modificados
git add .

# Adicionar apenas arquivos .js
git add *.js

# Commitar com mensagem
git commit -m "feat: adiciona nova funcionalidade"

# Commitar todos arquivos modificados (atalho)
git commit -am "fix: corrige bug no login"
```

### 6.3. Sincronizar com GitHub

```bash
# Baixar alterações do GitHub
git pull origin main

# Enviar alterações para GitHub
git push origin main

# Enviar e definir upstream (primeira vez)
git push -u origin main
```

### 6.4. Branches

```bash
# Criar nova branch
git branch feature/nova-funcionalidade

# Mudar para branch
git checkout feature/nova-funcionalidade

# Criar e mudar (atalho)
git checkout -b feature/nova-funcionalidade

# Listar branches
git branch

# Deletar branch local
git branch -d feature/antiga

# Deletar branch remota
git push origin --delete feature/antiga
```

### 6.5. Desfazer Alterações

```bash
# Desfazer alterações em arquivo não commitado
git checkout -- arquivo.txt

# Desfazer git add
git reset HEAD arquivo.txt

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1

# Voltar para commit específico
git reset --hard abc1234
```

---

## 7. Workflow Diário

### 7.1. Começar o Dia

```bash
# 1. Baixar últimas alterações
git pull origin main

# 2. Criar branch para nova feature
git checkout -b feature/registro-visitantes

# 3. Trabalhar normalmente...
```

### 7.2. Durante o Desenvolvimento

```bash
# Verificar o que mudou
git status

# Ver diferenças
git diff

# Adicionar arquivos
git add .

# Commitar frequentemente
git commit -m "feat: adiciona formulário de visitantes"

# Continuar desenvolvendo...
git add .
git commit -m "style: melhora layout do formulário"
```

### 7.3. Finalizar Feature

```bash
# 1. Commitar últimas alterações
git add .
git commit -m "feat: finaliza registro de visitantes"

# 2. Voltar para main
git checkout main

# 3. Baixar últimas alterações
git pull origin main

# 4. Fazer merge da feature
git merge feature/registro-visitantes

# 5. Enviar para GitHub
git push origin main

# 6. Deletar branch local (opcional)
git branch -d feature/registro-visitantes
```

### 7.4. Commits Semânticos (Recomendado)

Use prefixos para organizar commits:

```bash
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "fix: corrige bug no login"
git commit -m "docs: atualiza README"
git commit -m "style: formata código"
git commit -m "refactor: reorganiza estrutura"
git commit -m "test: adiciona testes unitários"
git commit -m "chore: atualiza dependências"
```

**Tipos:**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (não afeta código)
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 8. Troubleshooting

### Problema: Erro ao fazer push (autenticação)

**Causa:** Token inválido ou expirado

**Solução:**
```bash
# Remover credenciais salvas
git config --global --unset credential.helper

# Fazer push novamente (pedirá credenciais)
git push origin main

# Username: seu_usuario
# Password: COLE_SEU_TOKEN_AQUI
```

### Problema: "fatal: remote origin already exists"

**Solução:**
```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin git@github.com:SEU_USUARIO/repositorio.git
```

### Problema: Conflitos no merge

**Solução:**
```bash
# 1. Ver arquivos com conflito
git status

# 2. Abrir arquivo e resolver conflitos manualmente
# Procure por:
# <<<<<<< HEAD
# seu código
# =======
# código do servidor
# >>>>>>> branch

# 3. Após resolver, adicionar arquivo
git add arquivo-resolvido.txt

# 4. Continuar merge
git commit -m "merge: resolve conflitos"
```

### Problema: Commitou arquivo sensível (.env)

**Solução:**
```bash
# Remover do Git (mas manter local)
git rm --cached .env

# Adicionar ao .gitignore
echo ".env" >> .gitignore

# Commitar remoção
git add .gitignore
git commit -m "chore: remove .env do git"
git push origin main

# IMPORTANTE: Trocar senhas/tokens expostos!
```

### Problema: Muitos arquivos não rastreados

**Solução:**
```bash
# Limpar arquivos não rastreados (cuidado!)
git clean -n  # Ver o que será removido
git clean -f  # Remover arquivos
git clean -fd # Remover arquivos e pastas
```

---

## 9. Boas Práticas

### 9.1. Commits

✅ **Fazer:**
- Commits frequentes e pequenos
- Mensagens descritivas
- Um commit = uma mudança lógica
- Usar commits semânticos

❌ **Evitar:**
- Commits gigantes
- Mensagens vagas ("fix", "update")
- Commitar código quebrado
- Commitar arquivos sensíveis

### 9.2. Branches

✅ **Usar:**
- `main` - código em produção
- `develop` - desenvolvimento
- `feature/nome` - novas funcionalidades
- `fix/nome` - correções
- `hotfix/nome` - correções urgentes

### 9.3. .gitignore

✅ **Sempre ignorar:**
- `node_modules/`
- `.env` e arquivos de configuração local
- `dist/` e `build/`
- Logs
- Uploads de usuários
- Arquivos de IDE

### 9.4. README.md

✅ **Incluir:**
- Descrição do projeto
- Como instalar
- Como executar
- Tecnologias usadas
- Credenciais de teste
- Screenshots (opcional)

---

## 10. Comandos Rápidos (Cheat Sheet)

```bash
# Configuração inicial
git config --global user.name "Nome"
git config --global user.email "email@exemplo.com"

# Iniciar
git init
git add .
git commit -m "Initial commit"

# Conectar GitHub
git remote add origin URL
git push -u origin main

# Workflow diário
git pull origin main
git checkout -b feature/nome
# ... fazer alterações ...
git add .
git commit -m "feat: descrição"
git checkout main
git merge feature/nome
git push origin main

# Ver status
git status
git log --oneline
git branch

# Desfazer
git checkout -- arquivo  # Desfazer alterações
git reset HEAD arquivo   # Remover do staging
git reset --soft HEAD~1  # Desfazer commit
```

---

## 11. Recursos Úteis

### Documentação:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

### Ferramentas:
- **GitHub Desktop** - Interface gráfica
- **GitKraken** - Cliente Git visual
- **VS Code** - Integração Git nativa

### Aprender:
- [Learn Git Branching](https://learngitbranching.js.org/)
- [Git Immersion](https://gitimmersion.com/)
- [Oh My Git!](https://ohmygit.org/) - Jogo para aprender Git

---

## 12. Próximos Passos

Após configurar Git e GitHub:

1. ✅ Fazer commits regulares
2. ✅ Usar branches para features
3. ✅ Manter README atualizado
4. ✅ Adicionar LICENSE
5. ✅ Considerar CI/CD (GitHub Actions)
6. ✅ Proteger branch main
7. ✅ Usar Pull Requests para código review

---

## ✅ Checklist Final

- [ ] Git instalado
- [ ] Git configurado (nome e email)
- [ ] Conta GitHub criada
- [ ] Token ou SSH configurado
- [ ] .gitignore criado
- [ ] Git inicializado (`git init`)
- [ ] Primeiro commit feito
- [ ] Repositório GitHub criado
- [ ] Remote adicionado
- [ ] Código enviado (`git push`)
- [ ] Verificado no GitHub

---

## 🎉 Conclusão

Parabéns! Agora você tem:

✅ Git instalado e configurado  
✅ Projeto versionado  
✅ Código no GitHub  
✅ Conhecimento dos comandos essenciais  
✅ Workflow estabelecido  

**Seu código está seguro e versionado!** 🚀

Continue commitando regularmente e mantendo seu repositório atualizado!