# 🚀 Guia Rápido - Acessibilidade

**Comece a usar os recursos de acessibilidade em 5 minutos!**

---

## 📦 Passo 1: Setup Inicial

### Envolver a aplicação com o Provider

```tsx
// App.tsx ou main.tsx
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import './styles/accessibility.css';

function App() {
  return (
    <AccessibilityProvider>
      <YourApp />
    </AccessibilityProvider>
  );
}
```

---

## 🎨 Passo 2: Adicionar Barra de Ferramentas

```tsx
// App.tsx
import AccessibilityToolbar from './components/AccessibilityToolbar';

function App() {
  return (
    <AccessibilityProvider>
      <YourApp />
      
      {/* Adicione no final, antes de fechar o Provider */}
      <AccessibilityToolbar />
    </AccessibilityProvider>
  );
}
```

**Pronto!** Você já tem uma barra de ferramentas flutuante com todos os controles! 🎉

---

## 🔧 Passo 3: Usar Hooks nos Componentes

### Exemplo 1: Controle de Fonte

```tsx
import { useFontSize } from './hooks';

function MyComponent() {
  const { fontSize, increase, decrease } = useFontSize();

  return (
    <div>
      <button onClick={decrease}>A-</button>
      <span>{fontSize}px</span>
      <button onClick={increase}>A+</button>
    </div>
  );
}
```

### Exemplo 2: Text-to-Speech

```tsx
import { useTextToSpeech } from './hooks';

function Article() {
  const { speakText, isSpeaking } = useTextToSpeech();

  return (
    <article>
      <h1>Meu Artigo</h1>
      <p>Conteúdo do artigo...</p>
      
      <button 
        onClick={() => speakText('Conteúdo do artigo...')}
        disabled={isSpeaking}
      >
        {isSpeaking ? '🔊 Falando...' : '🔊 Ler Artigo'}
      </button>
    </article>
  );
}
```

### Exemplo 3: Navegação por Teclado

```tsx
import { useRef } from 'react';
import { useKeyboardNavigation } from './hooks';

function Menu() {
  const menuRef = useRef(null);
  
  useKeyboardNavigation(menuRef, {
    selector: 'button',
    onSelect: (element) => element.click()
  });

  return (
    <nav ref={menuRef}>
      <button>Home</button>
      <button>Produtos</button>
      <button>Contato</button>
    </nav>
  );
}
```

### Exemplo 4: Modal Acessível

```tsx
import { useRef } from 'react';
import { useFocusTrap } from './hooks';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  
  useFocusTrap(modalRef, isOpen, {
    autoFocus: true,
    restoreFocus: true
  });

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      <h2>Modal Title</h2>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}
```

---

## 📱 Passo 4: Adicionar Atributos ARIA

### Em formulários:

```tsx
<form>
  <label htmlFor="email">E-mail:</label>
  <input 
    id="email" 
    type="email"
    aria-required="true"
    aria-describedby="email-help"
  />
  <span id="email-help">Digite um e-mail válido</span>
</form>
```

### Em botões sem texto:

```tsx
<button aria-label="Fechar">
  ×
</button>
```

### Em imagens:

```tsx
<img src="logo.png" alt="Logo da Empresa" />
```

---

## ⌨️ Passo 5: Atalhos de Teclado (Automático!)

Apenas adicione este hook em qualquer lugar:

```tsx
import { useAccessibilityShortcuts } from './hooks';

function App() {
  useAccessibilityShortcuts(); // Pronto!
  
  return <YourApp />;
}
```

**Atalhos disponíveis:**
- `Ctrl + +` : Aumentar fonte
- `Ctrl + -` : Diminuir fonte
- `Ctrl + Alt + H` : Alto contraste
- `Ctrl + Alt + S` : Leitura simplificada
- `Ctrl + Alt + T` : Text-to-Speech
- `Ctrl + Alt + ?` : Mostrar ajuda

---

## 🎯 Exemplos Prontos para Copiar

### Página Completa com Acessibilidade

```tsx
import React from 'react';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import AccessibilityToolbar from './components/AccessibilityToolbar';
import { useAccessibilityShortcuts } from './hooks';
import './styles/accessibility.css';

function App() {
  useAccessibilityShortcuts();

  return (
    <AccessibilityProvider>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>

      <header role="banner">
        <h1>Minha Aplicação</h1>
        <nav role="navigation" aria-label="Menu principal">
          <a href="#home">Home</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main id="main-content" role="main">
        <h2>Conteúdo Principal</h2>
        <p>Seu conteúdo aqui...</p>
      </main>

      <footer role="contentinfo">
        <p>© 2025 - Minha Aplicação</p>
      </footer>

      <AccessibilityToolbar />
    </AccessibilityProvider>
  );
}

export default App;
```

### Componente de Card Acessível

```tsx
import { useTextToSpeech } from './hooks';

interface CardProps {
  title: string;
  description: string;
}

function Card({ title, description }: CardProps) {
  const { speakText } = useTextToSpeech();

  return (
    <article 
      role="article"
      aria-labelledby={`card-title-${title}`}
    >
      <h3 id={`card-title-${title}`}>{title}</h3>
      <p>{description}</p>
      
      <button 
        onClick={() => speakText(`${title}. ${description}`)}
        aria-label={`Ler ${title}`}
      >
        🔊
      </button>
    </article>
  );
}
```

---

## 🧪 Teste Rápido

### 1. Teste com Teclado (2 minutos)
1. Pressione `Tab` repetidamente
2. Todos os botões e links devem ser alcançados
3. O foco deve ser visível
4. Pressione `Enter` para ativar elementos

### 2. Teste de Contraste (1 minuto)
1. Abra Chrome DevTools (F12)
2. Inspecione um texto
3. Clique no seletor de cor
4. Verifique se o indicador está verde ✅

### 3. Teste com Leitor de Tela (5 minutos)
**Windows:**
1. Baixe NVDA (gratuito): https://www.nvaccess.org/
2. Abra sua aplicação
3. Pressione `Insert + Down` para navegar
4. Ouça se o conteúdo faz sentido

**macOS:**
1. Pressione `Cmd + F5` para ativar VoiceOver
2. Use `VO + Setas` para navegar
3. Pressione `Cmd + F5` novamente para desativar

---

## 📚 Próximos Passos

### Documentação Completa
```bash
# Leia a documentação dos hooks
cat frontend/src/hooks/README.md

# Veja o exemplo completo
cat frontend/src/examples/AccessibleApp.example.tsx

# Guia de testes
cat frontend/ACCESSIBILITY_TESTING.md
```

### Recursos Adicionais

1. **Todos os Hooks Disponíveis:**
   - `useFontSize` - Controle de fonte
   - `useHighContrast` - Alto contraste
   - `useSimplifiedReading` - Leitura simplificada
   - `useLibras` - LIBRAS
   - `useKeyboardNavigation` - Navegação por teclado
   - `useFocusTrap` - Armadilha de foco
   - `useAccessibilityShortcuts` - Atalhos
   - `useScreenReader` - Leitores de tela
   - `useTextToSpeech` - TTS
   - `useAriaAnnouncer` - Anúncios ARIA
   - `useAccessibilityPreferences` - Preferências

2. **Importação Rápida:**
   ```tsx
   // Importe todos de uma vez
   import {
     useFontSize,
     useHighContrast,
     useTextToSpeech,
     // ... outros hooks
   } from './hooks';
   ```

---

## ⚡ Dicas Rápidas

### ✅ FAÇA:
- Use elementos semânticos HTML (`<nav>`, `<main>`, `<button>`)
- Adicione `alt` em todas as imagens
- Use `aria-label` em ícones
- Garanta contraste mínimo de 4.5:1
- Teste com Tab e Enter

### ❌ NÃO FAÇA:
- Não use `<div>` como botão (use `<button>`)
- Não deixe imagens sem `alt`
- Não use cores como única forma de informação
- Não crie armadilhas de foco não intencionais
- Não esqueça de testar com leitores de tela

---

## 🆘 Problemas Comuns

### Hook não funciona?
```tsx
// ❌ Errado - fora do Provider
function App() {
  const { fontSize } = useFontSize(); // Erro!
  return <div>...</div>;
}

// ✅ Correto - dentro do Provider
function MyComponent() {
  const { fontSize } = useFontSize(); // OK!
  return <div>...</div>;
}

function App() {
  return (
    <AccessibilityProvider>
      <MyComponent />
    </AccessibilityProvider>
  );
}
```

### TTS não fala?
```tsx
// Verifique se está habilitado
const { isEnabled, speakText } = useTextToSpeech();

if (!isEnabled) {
  console.log('TTS está desabilitado');
}
```

### Estilos não aplicam?
```tsx
// Certifique-se de importar o CSS
import './styles/accessibility.css';
```

---

## 🎉 Pronto!

Você agora tem uma aplicação completamente acessível em apenas 5 passos!

### Checklist Final:
- ✅ Provider configurado
- ✅ Toolbar adicionada
- ✅ Hooks sendo usados
- ✅ CSS importado
- ✅ Atributos ARIA adicionados
- ✅ Testado com teclado

### Continue Aprendendo:
1. Leia a [documentação completa](./src/hooks/README.md)
2. Veja o [exemplo completo](./src/examples/AccessibleApp.example.tsx)
3. Siga o [guia de testes](./ACCESSIBILITY_TESTING.md)
4. Confira o [resumo](./ACCESSIBILITY_SUMMARY.md)

---

**Dúvidas?** Consulte a documentação ou entre em contato!

**Desenvolvido com ♥ e foco em inclusão digital**

