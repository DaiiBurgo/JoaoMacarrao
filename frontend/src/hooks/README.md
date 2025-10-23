# Hooks de Acessibilidade

Este diretório contém hooks personalizados React para facilitar a implementação de funcionalidades de acessibilidade na aplicação.

## Índice

- [Hooks Básicos](#hooks-básicos)
- [Hooks de Interação](#hooks-de-interação)
- [Hooks de Leitura e Anúncio](#hooks-de-leitura-e-anúncio)
- [Hook de Preferências](#hook-de-preferências)
- [Exemplos de Uso](#exemplos-de-uso)

---

## Hooks Básicos

### `useFontSize`

Controla o tamanho da fonte da aplicação.

**Retorno:**
- `fontSize`: Tamanho atual da fonte (number)
- `increase()`: Aumenta o tamanho da fonte
- `decrease()`: Diminui o tamanho da fonte
- `setFontSize(size)`: Define um tamanho específico
- `reset()`: Reseta para o tamanho padrão (16px)
- `canIncrease`: Boolean indicando se pode aumentar
- `canDecrease`: Boolean indicando se pode diminuir
- `percentage`: Percentual em relação ao tamanho padrão

**Exemplo:**
```tsx
import { useFontSize } from '../hooks/useFontSize';

function FontControls() {
  const { fontSize, increase, decrease, percentage, canIncrease, canDecrease } = useFontSize();

  return (
    <div>
      <p>Tamanho atual: {fontSize}px ({percentage}%)</p>
      <button onClick={decrease} disabled={!canDecrease}>A-</button>
      <button onClick={increase} disabled={!canIncrease}>A+</button>
    </div>
  );
}
```

---

### `useHighContrast`

Controla o modo de alto contraste.

**Retorno:**
- `isEnabled`: Boolean indicando se está ativo
- `enable()`: Ativa o modo de alto contraste
- `disable()`: Desativa o modo
- `toggle()`: Alterna o estado

**Exemplo:**
```tsx
import { useHighContrast } from '../hooks/useHighContrast';

function ContrastToggle() {
  const { isEnabled, toggle } = useHighContrast();

  return (
    <button onClick={toggle}>
      {isEnabled ? 'Desativar' : 'Ativar'} Alto Contraste
    </button>
  );
}
```

---

### `useSimplifiedReading`

Controla o modo de leitura simplificada.

**Retorno:**
- `isEnabled`: Boolean indicando se está ativo
- `enable()`: Ativa o modo
- `disable()`: Desativa o modo
- `toggle()`: Alterna o estado
- `simplifyContent(containerId)`: Simplifica o conteúdo de um container específico

**Exemplo:**
```tsx
import { useSimplifiedReading } from '../hooks/useSimplifiedReading';

function SimplifiedReadingToggle() {
  const { isEnabled, toggle, simplifyContent } = useSimplifiedReading();

  useEffect(() => {
    simplifyContent('main-content');
  }, [isEnabled]);

  return (
    <button onClick={toggle}>
      Leitura Simplificada: {isEnabled ? 'ON' : 'OFF'}
    </button>
  );
}
```

---

### `useLibras`

Controla o player de LIBRAS (Língua Brasileira de Sinais).

**Retorno:**
- `isEnabled`: Boolean indicando se está ativo
- `isPlayerVisible`: Boolean indicando se o player está visível
- `playerConfig`: Configuração atual do player
- `playerStyle`: Estilos CSS para posicionar o player
- `enable()`: Ativa o modo LIBRAS
- `disable()`: Desativa o modo
- `toggle()`: Alterna o estado
- `showPlayer()`: Mostra o player
- `hidePlayer()`: Oculta o player
- `updatePlayerConfig(config)`: Atualiza a configuração

**Exemplo:**
```tsx
import { useLibras } from '../hooks/useLibras';

function LibrasPlayer() {
  const { isPlayerVisible, playerStyle, toggle, updatePlayerConfig } = useLibras({
    position: 'bottom-right',
    size: 'medium'
  });

  if (!isPlayerVisible) return null;

  return (
    <div style={playerStyle}>
      <video src="/path/to/libras-video.mp4" controls />
      <button onClick={() => updatePlayerConfig({ position: 'bottom-left' })}>
        Mudar Posição
      </button>
    </div>
  );
}
```

---

## Hooks de Interação

### `useKeyboardNavigation`

Facilita a navegação por teclado em um container.

**Parâmetros:**
- `containerRef`: Referência ao elemento container
- `options`: Objeto de configuração
  - `selector`: Seletor CSS para elementos navegáveis
  - `loop`: Se deve fazer loop ao chegar no final (padrão: true)
  - `onFocus`: Callback quando um elemento é focado
  - `onSelect`: Callback quando Enter é pressionado

**Retorno:**
- `focusNext()`: Foca no próximo elemento
- `focusPrevious()`: Foca no elemento anterior
- `focusFirst()`: Foca no primeiro elemento
- `focusLast()`: Foca no último elemento
- `focusIndex(index)`: Foca em um elemento específico
- `currentIndex`: Índice do elemento atualmente focado

**Exemplo:**
```tsx
import { useRef } from 'react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);

  const { focusNext, focusPrevious } = useKeyboardNavigation(menuRef, {
    selector: 'button',
    loop: true,
    onSelect: (element) => element.click(),
  });

  return (
    <div ref={menuRef} role="menu">
      <button>Item 1</button>
      <button>Item 2</button>
      <button>Item 3</button>
    </div>
  );
}
```

---

### `useFocusTrap`

Cria uma armadilha de foco para modais e diálogos.

**Parâmetros:**
- `containerRef`: Referência ao elemento container
- `isActive`: Boolean indicando se a armadilha está ativa
- `options`: Objeto de configuração
  - `autoFocus`: Focar automaticamente no primeiro elemento (padrão: true)
  - `restoreFocus`: Retornar o foco ao elemento anterior (padrão: true)
  - `loop`: Fazer loop ao chegar no final (padrão: true)
  - `onActivate`: Callback quando ativada
  - `onDeactivate`: Callback quando desativada

**Retorno:**
- `focusFirstElement()`: Foca no primeiro elemento
- `focusLastElement()`: Foca no último elemento
- `getFocusableElements()`: Retorna lista de elementos focáveis

**Exemplo:**
```tsx
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen, {
    autoFocus: true,
    restoreFocus: true,
    onDeactivate: onClose,
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

### `useAccessibilityShortcuts`

Gerencia atalhos de teclado para funcionalidades de acessibilidade.

**Parâmetros:**
- `customShortcuts`: Array de atalhos personalizados

**Retorno:**
- `shortcuts`: Lista de todos os atalhos disponíveis
- `formatShortcut(shortcut)`: Formata um atalho para exibição
- `showShortcutsHelp()`: Mostra modal com ajuda

**Atalhos Padrão:**
- `Ctrl + +`: Aumentar fonte
- `Ctrl + -`: Diminuir fonte
- `Ctrl + Alt + H`: Alto contraste
- `Ctrl + Alt + S`: Leitura simplificada
- `Ctrl + Alt + T`: Text-to-Speech
- `Ctrl + Alt + L`: LIBRAS
- `Ctrl + Alt + ?`: Mostrar ajuda de atalhos

**Exemplo:**
```tsx
import { useAccessibilityShortcuts } from '../hooks/useAccessibilityShortcuts';

function App() {
  const customShortcuts = [
    {
      key: 'm',
      ctrlKey: true,
      action: () => console.log('Menu aberto'),
      description: 'Abrir menu principal',
    },
  ];

  const { shortcuts, formatShortcut } = useAccessibilityShortcuts(customShortcuts);

  return (
    <div>
      <h3>Atalhos Disponíveis:</h3>
      <ul>
        {shortcuts.map((s, i) => (
          <li key={i}>
            <kbd>{formatShortcut(s)}</kbd>: {s.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Hooks de Leitura e Anúncio

### `useScreenReader`

Facilita o suporte a leitores de tela.

**Retorno:**
- `announce(message, priority)`: Anuncia uma mensagem
- `announceError(message)`: Anuncia um erro
- `announceSuccess(message)`: Anuncia sucesso
- `announceLoading(message)`: Anuncia carregamento
- `detectScreenReader()`: Detecta se há leitor de tela ativo
- `focusElement(id, label)`: Foca em um elemento
- `setAriaLabel(id, label)`: Define aria-label
- `setAriaDescription(id, description)`: Define aria-description

**Exemplo:**
```tsx
import { useScreenReader } from '../hooks/useScreenReader';

function Form() {
  const { announceSuccess, announceError } = useScreenReader();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ... submit logic
      announceSuccess('Formulário enviado com sucesso!');
    } catch (error) {
      announceError('Erro ao enviar formulário.');
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### `useTextToSpeech`

Facilita o uso de Text-to-Speech.

**Retorno:**
- `speakText(text)`: Fala um texto
- `speakElement(elementId)`: Fala o conteúdo de um elemento
- `announceMessage(message, priority)`: Anuncia uma mensagem
- `addToQueue(text)`: Adiciona texto à fila
- `processQueue()`: Processa a fila de textos
- `isSpeaking`: Boolean indicando se está falando
- `isEnabled`: Boolean indicando se TTS está ativo

**Exemplo:**
```tsx
import { useTextToSpeech } from '../hooks/useTextToSpeech';

function Article() {
  const { speakText, isSpeaking, isEnabled } = useTextToSpeech();

  const handleReadArticle = () => {
    speakText('Este é o conteúdo do artigo...');
  };

  if (!isEnabled) return null;

  return (
    <button onClick={handleReadArticle} disabled={isSpeaking}>
      {isSpeaking ? 'Falando...' : 'Ler Artigo'}
    </button>
  );
}
```

---

### `useAriaAnnouncer`

Anúncios ARIA avançados.

**Retorno:**
- `announce(message, options)`: Anuncia uma mensagem
- `announceError(message, delay)`: Anuncia erro
- `announceSuccess(message, delay)`: Anuncia sucesso
- `announceWarning(message, delay)`: Anuncia aviso
- `announceInfo(message, delay)`: Anuncia informação
- `announceLoading(message, delay)`: Anuncia carregamento
- `clearLoading()`: Limpa anúncio de carregamento
- `announceNavigation(pageName)`: Anuncia navegação
- `announceCount(count, itemType)`: Anuncia contagem

**Exemplo:**
```tsx
import { useAriaAnnouncer } from '../hooks/useAriaAnnouncer';

function SearchResults() {
  const { announceCount, announceLoading, clearLoading } = useAriaAnnouncer();
  const [results, setResults] = useState([]);

  const search = async (query) => {
    announceLoading('Buscando...');
    const data = await fetchResults(query);
    setResults(data);
    clearLoading();
    announceCount(data.length, 'resultados');
  };

  return <div>...</div>;
}
```

---

## Hook de Preferências

### `useAccessibilityPreferences`

Gerencia preferências de acessibilidade do usuário.

**Retorno:**
- `settings`: Configurações atuais
- `updateSettings(updates)`: Atualiza configurações
- `resetSettings()`: Reseta para padrão
- `setLanguage(lang)`: Define o idioma
- `setVoiceGender(gender)`: Define o gênero da voz
- `savePreferences()`: Salva no backend
- `loadPreferences()`: Carrega do backend
- `exportPreferences()`: Exporta como JSON
- `importPreferences(file)`: Importa de JSON
- `hasCustomPreferences`: Boolean indicando se há preferências customizadas

**Exemplo:**
```tsx
import { useAccessibilityPreferences } from '../hooks/useAccessibilityPreferences';

function SettingsPanel() {
  const {
    settings,
    setLanguage,
    savePreferences,
    exportPreferences,
    hasCustomPreferences,
  } = useAccessibilityPreferences();

  return (
    <div>
      <select value={settings.language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="pt-BR">Português</option>
        <option value="en-US">English</option>
        <option value="es-ES">Español</option>
      </select>

      <button onClick={savePreferences}>Salvar Preferências</button>
      <button onClick={exportPreferences}>Exportar</button>

      {hasCustomPreferences && (
        <span>Você tem preferências personalizadas</span>
      )}
    </div>
  );
}
```

---

## Exemplos de Uso

### Exemplo Completo: Página Acessível

```tsx
import React, { useRef } from 'react';
import {
  useFontSize,
  useHighContrast,
  useTextToSpeech,
  useScreenReader,
  useKeyboardNavigation,
  useAccessibilityShortcuts,
} from './hooks';

function AccessiblePage() {
  const menuRef = useRef<HTMLDivElement>(null);

  // Controles de fonte
  const { fontSize, increase, decrease } = useFontSize();

  // Alto contraste
  const { isEnabled: highContrast, toggle: toggleContrast } = useHighContrast();

  // Text-to-Speech
  const { speakText, isEnabled: ttsEnabled } = useTextToSpeech();

  // Screen Reader
  const { announceSuccess } = useScreenReader();

  // Navegação por teclado
  useKeyboardNavigation(menuRef, {
    onSelect: (element) => {
      announceSuccess(`${element.textContent} selecionado`);
      element.click();
    },
  });

  // Atalhos de teclado
  useAccessibilityShortcuts();

  const handleReadPage = () => {
    speakText('Bem-vindo à nossa página acessível!');
  };

  return (
    <div>
      <header>
        <h1>Página Acessível</h1>
        
        <nav ref={menuRef} role="navigation" aria-label="Menu principal">
          <button onClick={() => console.log('Home')}>Home</button>
          <button onClick={() => console.log('Sobre')}>Sobre</button>
          <button onClick={() => console.log('Contato')}>Contato</button>
        </nav>

        <div role="toolbar" aria-label="Ferramentas de acessibilidade">
          <button onClick={decrease} aria-label="Diminuir fonte">A-</button>
          <span aria-live="polite">{fontSize}px</span>
          <button onClick={increase} aria-label="Aumentar fonte">A+</button>
          
          <button onClick={toggleContrast}>
            Alto Contraste: {highContrast ? 'ON' : 'OFF'}
          </button>

          {ttsEnabled && (
            <button onClick={handleReadPage}>
              🔊 Ler Página
            </button>
          )}
        </div>
      </header>

      <main>
        <article>
          <h2>Conteúdo Principal</h2>
          <p>Este é um exemplo de página com recursos de acessibilidade.</p>
        </article>
      </main>
    </div>
  );
}

export default AccessiblePage;
```

---

## Boas Práticas

1. **Sempre use os hooks dentro do `AccessibilityProvider`**
2. **Combine múltiplos hooks conforme necessário**
3. **Use `aria-*` attributes para melhor suporte**
4. **Teste com leitores de tela reais**
5. **Forneça alternativas textuais para conteúdo visual**
6. **Use semântica HTML adequada**
7. **Garanta contraste adequado de cores**
8. **Torne toda funcionalidade acessível via teclado**

---

## Contribuindo

Ao adicionar novos hooks:
1. Documente claramente parâmetros e retorno
2. Adicione exemplos de uso
3. Mantenha compatibilidade com leitores de tela
4. Teste com diferentes dispositivos de entrada
5. Atualize este README

---

## Suporte

Para mais informações sobre acessibilidade web:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN: Accessibility](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility)
- [React Accessibility](https://pt-br.reactjs.org/docs/accessibility.html)

