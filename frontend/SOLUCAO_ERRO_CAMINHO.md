# 🔧 Solução: Erro no Caminho com Caracteres Especiais

## ❌ Problema

O Vite/Node.js no Windows pode ter problemas com caminhos que contêm caracteres especiais como:
- `João` (ã)
- `Macarrão` (ã, ç)

## ✅ Soluções (escolha uma)

---

### 🥇 SOLUÇÃO 1: Usar CMD em vez de PowerShell (RECOMENDADO)

1. **Abra o CMD** (não PowerShell):
   - Pressione `Win + R`
   - Digite `cmd`
   - Enter

2. **Navegue até a pasta:**
   ```cmd
   cd C:\Users\Nilson\João Macarrão\frontend
   ```

3. **Instale as dependências (se ainda não instalou):**
   ```cmd
   npm install
   ```

4. **Inicie o servidor:**
   ```cmd
   npm run dev
   ```

5. **Abra o navegador:**
   ```
   http://localhost:3000
   ```

---

### 🥈 SOLUÇÃO 2: Renomear a Pasta (Mais Permanente)

1. **Renomeie a pasta do projeto** removendo acentos:
   ```
   De: C:\Users\Nilson\João Macarrão
   Para: C:\Users\Nilson\JoaoMacarrao
   ```

2. **Navegue para a nova pasta:**
   ```powershell
   cd C:\Users\Nilson\JoaoMacarrao\frontend
   ```

3. **Instale e rode:**
   ```powershell
   npm install
   npm run dev
   ```

---

### 🥉 SOLUÇÃO 3: Usar Git Bash

1. **Abra Git Bash** (se tiver instalado)

2. **Navegue:**
   ```bash
   cd "/c/Users/Nilson/João Macarrão/frontend"
   ```

3. **Instale e rode:**
   ```bash
   npm install
   npm run dev
   ```

---

### 🥉 SOLUÇÃO 4: Usar VS Code Terminal

1. **Abra o VS Code**

2. **File > Open Folder** e selecione:
   ```
   C:\Users\Nilson\João Macarrão\frontend
   ```

3. **Abra o terminal integrado** (Ctrl + `)

4. **Escolha "Command Prompt" ou "Git Bash"** no dropdown do terminal

5. **Rode:**
   ```bash
   npm install
   npm run dev
   ```

---

## 🔍 Verificar se Funcionou

Após rodar `npm run dev`, você deve ver:

```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## ⚠️ Erros Comuns

### "npm: command not found"
- **Solução:** Instale o Node.js de https://nodejs.org/

### "Cannot find module"
- **Solução:** Rode `npm install` primeiro

### "Port 3000 already in use"
- **Solução:** Use outra porta:
  ```bash
  npm run dev -- --port 3001
  ```

### "Failed to scan for dependencies"
- **Solução:** Use a Solução 1 ou 2 acima

---

## 📝 Comandos Resumidos

### Primeira Vez:
```bash
# 1. Navegue até a pasta (use CMD!)
cd C:\Users\Nilson\João Macarrão\frontend

# 2. Instale dependências
npm install

# 3. Inicie servidor
npm run dev
```

### Próximas Vezes:
```bash
# 1. Navegue até a pasta
cd C:\Users\Nilson\João Macarrão\frontend

# 2. Inicie servidor
npm run dev
```

---

## 🎯 Ainda com Problemas?

### Limpar Cache e Reinstalar:

```bash
# 1. Deletar node_modules e package-lock.json
rmdir /s node_modules
del package-lock.json

# 2. Reinstalar
npm install

# 3. Tentar novamente
npm run dev
```

### Usar npx diretamente:

```bash
npx vite
```

---

## ✅ Após Funcionar

Você verá:
- 🎨 Nova identidade visual
- 🍝 Logo João Macarrão
- 📱 Layout responsivo
- 🎬 Animações suaves

Acesse: **http://localhost:3000**

---

## 💡 Dica Final

**Para evitar problemas futuros**, considere mover o projeto para um caminho sem caracteres especiais:

```
C:\projetos\joao-macarrao\frontend
```

ou

```
C:\dev\joao-macarrao\frontend
```

---

**🍝 Boa sorte! O projeto está pronto, é só resolver o caminho!**

