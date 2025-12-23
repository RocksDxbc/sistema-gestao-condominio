# ⚡ Git e GitHub - Resumo Executivo

## 🎯 3 Passos para Começar

### 1️⃣ Configurar (UMA VEZ)

```bash
# Instalar Git
# https://git-scm.com/download

# Configurar
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Criar conta GitHub
# https://github.com
```

### 2️⃣ Inicializar Projeto (UMA VEZ)

```bash
cd sistema-condominio

# Criar .gitignore (copiar do artifact)
# Inicializar
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub
# Conectar
git remote add origin git@github.com:USER/REPO.git
git push -u origin main
```

### 3️⃣ Usar Diariamente

```bash
# Manhã
git pull origin main

# Trabalhar
git add .
git commit -m "feat: nova funcionalidade"

# Enviar
git push origin main
```

---

## 📚 Documentação Disponível

| Documento | Artifact | Uso |
|-----------|----------|-----|
| **Manual Completo** | git_manual_completo | Guia detalhado |
| **Comandos Rápidos** | git_comandos_rapidos | Copy & paste |
| **Guia Visual** | git_guia_visual | Passo a passo ilustrado |
| **Este Resumo** | git_resumo_executivo | Visão geral |

---

## 🔑 Autenticação

### Opção 1: Token (Mais Fácil)

1. GitHub → Settings → Developer settings → Tokens
2. Generate new token (classic)
3. Copiar token
4. Usar como senha ao fazer `git push`

### Opção 2: SSH (Mais Seguro)

```bash
# Gerar chave
ssh-keygen -t ed25519 -C "seu@email.com"

# Copiar chave
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub
# Settings → SSH keys → New SSH key
```

---

## 📦 Comandos Essenciais

### Configuração

```bash
git config --global user.name "Nome"
git config --global user.email "email"
git config --list
```

### Inicializar

```bash
git init
git add .
git commit -m "Initial commit"
```

### Conectar GitHub

```bash
git remote add origin URL
git push -u origin main
```

### Diário

```bash
git pull          # Baixar
git add .         # Adicionar
git commit -m ""  # Salvar
git push          # Enviar
```

### Informações

```bash
git status        # Ver estado
git log           # Ver histórico
git branch        # Ver branches
```

---

## 🎨 Workflow Simples

```
1. git pull origin main
   ↓
2. [Desenvolver código]
   ↓
3. git add .
   ↓
4. git commit -m "feat: descrição"
   ↓
5. git push origin main
   ↓
6. Repetir! 🔄
```

---

## 🔧 Resolver Problemas

### Erro ao push

```bash
git pull origin main
# Resolver conflitos se houver
git push origin main
```

### Desfazer alterações

```bash
# Antes do commit
git checkout -- arquivo.txt

# Depois do commit
git reset --soft HEAD~1
```

### Remover arquivo sensível

```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: remove .env"
git push
```

---

## ✅ Checklist Rápido

### Setup:
- [ ] Git instalado
- [ ] Git configurado
- [ ] Conta GitHub criada
- [ ] Token ou SSH configurado

### Projeto:
- [ ] .gitignore criado
- [ ] git init executado
- [ ] Primeiro commit feito
- [ ] Repositório GitHub criado
- [ ] Remote adicionado
- [ ] Código enviado

### Uso Diário:
- [ ] git pull antes de começar
- [ ] Commits frequentes
- [ ] Mensagens descritivas
- [ ] git push ao finalizar

---

## 💡 Dicas Importantes

### ✅ Fazer

- Commits pequenos e frequentes
- Mensagens descritivas
- Pull antes de push
- Usar .gitignore
- Branches para features

### ❌ Evitar

- Commitar código quebrado
- Mensagens vagas
- Commitar .env
- Commits gigantes
- Trabalhar direto na main

---

## 📝 Commits Semânticos

```bash
feat:     # Nova funcionalidade
fix:      # Correção de bug
docs:     # Documentação
style:    # Formatação
refactor: # Refatoração
test:     # Testes
chore:    # Manutenção
```

**Exemplos:**
```bash
git commit -m "feat: adiciona dashboard de visitantes"
git commit -m "fix: corrige erro no login"
git commit -m "docs: atualiza README"
```

---

## 🌳 Branches

```bash
# Criar e mudar
git checkout -b feature/nova

# Trabalhar...
git add .
git commit -m "feat: trabalho na feature"

# Voltar e fazer merge
git checkout main
git merge feature/nova

# Deletar branch
git branch -d feature/nova
```

---

## 🆘 Ajuda Rápida

### Esqueceu comando?

```bash
git --help
git status --help
```

### Ver o que mudou?

```bash
git status
git diff
```

### Histórico?

```bash
git log
git log --oneline
```

### Desfazer?

```bash
git checkout -- arquivo  # Antes do add
git reset HEAD arquivo   # Depois do add
git reset --soft HEAD~1  # Depois do commit
```

---

## 🔗 Links Úteis

- [Git Download](https://git-scm.com/download)
- [GitHub](https://github.com)
- [Git Docs](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)

---

## 📞 Próximos Passos

Após setup completo:

1. ✅ Ler manual completo (git_manual_completo)
2. ✅ Praticar comandos básicos
3. ✅ Fazer commits diários
4. ✅ Explorar branches
5. ✅ Colaborar com equipe

---

## 🎉 Pronto!

Você agora sabe:

✅ Instalar e configurar Git  
✅ Criar conta no GitHub  
✅ Inicializar repositório  
✅ Fazer commits  
✅ Enviar código  
✅ Trabalhar em equipe  

**Seu código está seguro! 🚀**

---

## 📖 Ler Mais

Para informações detalhadas, consulte:

- **git_manual_completo** - Guia completo passo a passo
- **git_comandos_rapidos** - Comandos prontos para copiar
- **git_guia_visual** - Guia com diagramas visuais

**Boa sorte com Git! 💪**