# 🎨 Guia Visual - Git e GitHub Passo a Passo

## 📖 Índice Visual

1. [🔧 Instalação e Configuração](#1-instalação-e-configuração)
2. [🌐 Criar Conta GitHub](#2-criar-conta-github)
3. [🔑 Configurar Autenticação](#3-configurar-autenticação)
4. [📁 Inicializar Projeto](#4-inicializar-projeto)
5. [☁️ Enviar para GitHub](#5-enviar-para-github)
6. [💼 Workflow Visual](#6-workflow-visual)

---

## 1. Instalação e Configuração

### Passo 1.1: Instalar Git

**Windows:**
```
1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador
3. Execute e clique "Next" em tudo
4. Finish
```

**Verificar instalação:**
```bash
git --version
# ✅ Deve mostrar: git version 2.43.0
```

### Passo 1.2: Configurar Identidade

```bash
git config --global user.name "João Silva"
git config --global user.email "joao.silva@email.com"
```

**Verificar:**
```bash
git config --list
# ✅ Deve mostrar seu nome e email
```

---

## 2. Criar Conta GitHub

### Passo 2.1: Registro

```
┌─────────────────────────────────┐
│      GITHUB.COM                 │
│                                 │
│  ┌──────────────────────────┐  │
│  │  Sign up                 │  │
│  └──────────────────────────┘  │
│                                 │
│  Username: joaosilva           │
│  Email: joao@email.com         │
│  Password: ********             │
│                                 │
│  [Create account]              │
└─────────────────────────────────┘
```

1. Acesse: **https://github.com**
2. Clique: **Sign up**
3. Preencha:
   - Username: `joaosilva`
   - Email: `joao@email.com`
   - Password: senha forte
4. Verifique seu email
5. Escolha plano **Free**

---

## 3. Configurar Autenticação

### Opção A: Personal Access Token (Mais Fácil)

#### Passo 3.1: Gerar Token

```
GitHub → Avatar (canto sup. direito) → Settings

┌─────────────────────────────────────┐
│ Settings                            │
├─────────────────────────────────────┤
│ Profile                             │
│ Account                             │
│ Appearance                          │
│ ...                                 │
│ Developer settings          ◄──────┐│
└─────────────────────────────────────┘│
                                       │
┌──────────────────────────────────────┘
│
│ Personal access tokens
│ └─ Tokens (classic)  ◄─────────────┐
│    └─ Generate new token            │
│       └─ Generate new token (classic)
```

**Configuração do Token:**
```
Note: Token para projeto condominio
Expiration: 90 days
Select scopes:
  ✅ repo (marcar todos)
  ✅ workflow
  ✅ admin:repo_hook

[Generate token]
```

#### Passo 3.2: Copiar Token

```
┌──────────────────────────────────────────┐
│ ⚠️  Make sure to copy your personal      │
│    access token now. You won't be       │
│    able to see it again!                │
│                                          │
│ ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx │
│                               [Copy]     │
└──────────────────────────────────────────┘

⚠️ IMPORTANTE: Salve em local seguro!
```

### Opção B: SSH (Recomendado)

#### Passo 3.3: Gerar Chave SSH

```bash
ssh-keygen -t ed25519 -C "joao@email.com"

# Output:
# Generating public/private ed25519 key pair.
# Enter file: (pressione Enter)
# Enter passphrase: (pressione Enter)
# Enter same passphrase: (pressione Enter)
```

#### Passo 3.4: Copiar Chave Pública

```bash
# Linux/Mac
cat ~/.ssh/id_ed25519.pub

# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub

# Copie toda a linha começando com "ssh-ed25519"
```

#### Passo 3.5: Adicionar no GitHub

```
GitHub → Settings → SSH and GPG keys

┌─────────────────────────────────┐
│ SSH and GPG keys                │
├─────────────────────────────────┤
│                                 │
│ [New SSH key]    ◄──────────┐  │
│                             │  │
└─────────────────────────────┴──┘
                               │
┌──────────────────────────────┘
│
│ Add new SSH key
│ 
│ Title: Meu Notebook
│ 
│ Key: ssh-ed25519 AAAA... joao@email.com
│
│ [Add SSH key]
```

---

## 4. Inicializar Projeto

### Estrutura Visual

```
sistema-condominio/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   │   └── .gitkeep  ◄── Criar este arquivo
│   ├── .env          ◄── Será ignorado
│   ├── .gitignore    ◄── Já existe
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── .env          ◄── Será ignorado
│   ├── .gitignore    ◄── Já existe
│   └── ...
│
├── .gitignore        ◄── Criar na raiz
└── README.md         ◄── Criar na raiz
```

### Passo 4.1: Criar .gitignore Raiz

**Na pasta `sistema-condominio/`:**

```bash
# Criar arquivo
touch .gitignore

# Ou Windows
type nul > .gitignore
```

**Copiar conteúdo do artifact anterior**

### Passo 4.2: Inicializar Git

```bash
cd sistema-condominio

git init
```

**Output esperado:**
```
Initialized empty Git repository in
/caminho/sistema-condominio/.git/
```

**Estrutura após init:**
```
sistema-condominio/
├── .git/              ◄── Pasta criada (oculta)
├── .gitignore
├── backend/
└── frontend/
```

### Passo 4.3: Primeiro Commit

```bash
# Ver status
git status

# Adicionar todos arquivos
git add .

# Commitar
git commit -m "Initial commit: Sistema de Gestão de Condomínio"
```

**Visualização:**
```
┌───────────────────────────────┐
│ Working Directory             │
│ ├── backend/                  │
│ ├── frontend/                 │
│ └── .gitignore                │
└───────────────────────────────┘
         │ git add .
         ▼
┌───────────────────────────────┐
│ Staging Area                  │
│ ├── backend/  ✅              │
│ ├── frontend/ ✅              │
│ └── .gitignore ✅             │
└───────────────────────────────┘
         │ git commit
         ▼
┌───────────────────────────────┐
│ Local Repository              │
│ [●] Initial commit            │
└───────────────────────────────┘
```

---

## 5. Enviar para GitHub

### Passo 5.1: Criar Repositório

**GitHub Interface:**

```
┌────────────────────────────────────┐
│  +  ▼  [Seu Avatar]               │ ◄── Clique no +
└────────────────────────────────────┘
      │
      ├─ New repository  ◄────────────┐
      ├─ Import repository            │
      └─ ...                          │
                                      │
┌─────────────────────────────────────┘
│
│ Create a new repository
│
│ Owner: joaosilva
│ Repository name: sistema-gestao-condominio
│
│ Description: Sistema completo de gestão...
│
│ ○ Public    ● Private
│
│ ☐ Add a README file
│ ☐ Add .gitignore
│ ☐ Choose a license
│
│ [Create repository]
```

### Passo 5.2: Conectar Local com GitHub

**Após criar repositório, GitHub mostra:**

```
┌──────────────────────────────────────────┐
│ Quick setup                              │
├──────────────────────────────────────────┤
│                                          │
│ HTTPS  SSH                               │
│                                          │
│ https://github.com/joaosilva/repo.git   │
│                               [Copy]     │
│                                          │
│ …or push an existing repository         │
│                                          │
│ git remote add origin URL                │
│ git branch -M main                       │
│ git push -u origin main                  │
└──────────────────────────────────────────┘
```

**Executar comandos:**

```bash
# Com SSH
git remote add origin git@github.com:joaosilva/sistema-gestao-condominio.git

# Ou com HTTPS
git remote add origin https://github.com/joaosilva/sistema-gestao-condominio.git

# Garantir branch main
git branch -M main

# Enviar
git push -u origin main
```

**Se usar HTTPS, aparecerá:**
```
Username for 'https://github.com': joaosilva
Password for 'https://joaosilva@github.com': ◄── Cole o TOKEN aqui!
```

### Passo 5.3: Verificar no GitHub

**Refresh a página do repositório:**

```
┌─────────────────────────────────────────┐
│ joaosilva / sistema-gestao-condominio   │
├─────────────────────────────────────────┤
│                                         │
│ ├── 📁 backend/                         │
│ ├── 📁 frontend/                        │
│ ├── 📄 .gitignore                       │
│ └── 📄 README.md                        │
│                                         │
│ 42 commits  2 branches  1 contributor  │
└─────────────────────────────────────────┘

✅ Sucesso! Código está no GitHub!
```

---

## 6. Workflow Visual

### Ciclo Completo

```
┌─────────────────────────────────────────────┐
│                                             │
│  1️⃣  git pull origin main                  │
│      ▼                                      │
│      Atualizar local com GitHub            │
│                                             │
│  2️⃣  git checkout -b feature/nova          │
│      ▼                                      │
│      Criar branch para desenvolvimento     │
│                                             │
│  3️⃣  Desenvolver...                        │
│      ▼                                      │
│      Escrever código                       │
│                                             │
│  4️⃣  git add .                             │
│      git commit -m "feat: nova feature"    │
│      ▼                                      │
│      Salvar alterações localmente          │
│                                             │
│  5️⃣  git checkout main                     │
│      git merge feature/nova                │
│      ▼                                      │
│      Juntar feature na main                │
│                                             │
│  6️⃣  git push origin main                  │
│      ▼                                      │
│      Enviar para GitHub                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Estado dos Arquivos

```
┌──────────────┐  git add   ┌──────────────┐  git commit  ┌──────────────┐
│              │  ──────>   │              │  ──────────> │              │
│   Working    │            │   Staging    │              │  Repository  │
│   Directory  │            │     Area     │              │   (Local)    │
│              │  <──────   │              │              │              │
└──────────────┘  checkout  └──────────────┘              └──────────────┘
                                                                 │
                                                                 │ git push
                                                                 ▼
                                                          ┌──────────────┐
                                                          │              │
                                                          │   GitHub     │
                                                          │   (Remote)   │
                                                          │              │
                                                          └──────────────┘
```

### Branches Visualizadas

```
main      ●────●────●────●────●────●
               │         │
feature/a      └───●─────┘
                   │
feature/b          └───●───●
```

**Comandos:**
```bash
# Criar branch
git checkout -b feature/a

# Trabalhar na feature
git add .
git commit -m "trabalho na feature A"

# Voltar para main e fazer merge
git checkout main
git merge feature/a
```

---

## 7. Estados e Comandos

### Árvore de Comandos

```
git status
  │
  ├─ Untracked files
  │  └─> git add arquivo.txt
  │
  ├─ Changes not staged
  │  └─> git add arquivo.txt
  │
  ├─ Changes to be committed
  │  └─> git commit -m "mensagem"
  │
  └─ Nothing to commit
     └─> git push origin main
```

### Desfazer Operações

```
Modificou arquivo
      │
      ├─> Não fez git add?
      │   └─> git checkout -- arquivo.txt
      │
      ├─> Fez git add?
      │   └─> git reset HEAD arquivo.txt
      │       └─> git checkout -- arquivo.txt
      │
      └─> Já fez commit?
          └─> git reset --soft HEAD~1
              └─> git reset HEAD arquivo.txt
                  └─> git checkout -- arquivo.txt
```

---

## 8. Checklist Visual

### Setup Completo

```
☐ 1. Instalar Git
    └─> git --version ✅

☐ 2. Configurar identidade
    └─> git config --list ✅

☐ 3. Criar conta GitHub
    └─> Login em github.com ✅

☐ 4. Configurar autenticação
    ├─> Token gerado ✅
    └─> ou SSH configurado ✅

☐ 5. Criar .gitignore
    └─> Na raiz do projeto ✅

☐ 6. Inicializar Git
    └─> git init ✅

☐ 7. Primeiro commit
    └─> git commit -m "Initial" ✅

☐ 8. Criar repo GitHub
    └─> Repository criado ✅

☐ 9. Conectar remote
    └─> git remote add origin ✅

☐ 10. Enviar código
    └─> git push -u origin main ✅

✅ Tudo configurado!
```

---

## 9. Comandos do Dia a Dia

### Manhã (Começar trabalho)

```
┌──────────────────────────────┐
│ 1. Abrir terminal            │
│                              │
│ 2. cd sistema-condominio     │
│                              │
│ 3. git pull origin main      │
│                              │
│ 4. git checkout -b feature/X │
│                              │
│ 5. Começar a codar! 💻       │
└──────────────────────────────┘
```

### Durante (Trabalhando)

```
┌──────────────────────────────┐
│ A cada 30 min ou feature:    │
│                              │
│ 1. git status                │
│                              │
│ 2. git add .                 │
│                              │
│ 3. git commit -m "feat: X"   │
└──────────────────────────────┘
```

### Fim do Dia (Enviar)

```
┌──────────────────────────────┐
│ 1. git checkout main         │
│                              │
│ 2. git pull origin main      │
│                              │
│ 3. git merge feature/X       │
│                              │
│ 4. git push origin main      │
│                              │
│ 5. git branch -d feature/X   │
└──────────────────────────────┘
```

---

## 10. Troubleshooting Visual

### Problema: Conflito

```
Auto-merging arquivo.txt
CONFLICT (content): Merge conflict in arquivo.txt
Automatic merge failed; fix conflicts

┌──────────────────────────────┐
│ arquivo.txt                  │
├──────────────────────────────┤
│ texto normal                 │
│ <<<<<<< HEAD                 │
│ sua versão                   │
│ =======                      │
│ versão do servidor           │
│ >>>>>>> branch               │
│ texto normal                 │
└──────────────────────────────┘

Solução:
1. Abrir arquivo
2. Escolher qual versão manter
3. Deletar marcadores (<<<<, ====, >>>>)
4. git add arquivo.txt
5. git commit -m "merge: resolve conflito"
```

---

## 🎉 Conclusão Visual

```
   ┌────────┐
   │  Você  │
   └────┬───┘
        │ git push
        │
        ▼
   ┌─────────┐
   │ GitHub  │
   └─────────┘
        │
        │ Todo mundo pode ver!
        │
        ▼
   ┌──────────────┐
   │ Equipe       │
   │ ├─ Dev 1     │
   │ ├─ Dev 2     │
   │ └─ Dev 3     │
   └──────────────┘

✅ Código versionado
✅ Backup automático
✅ Colaboração fácil
✅ Histórico completo
```

**Seu projeto está seguro e profissional! 🚀**