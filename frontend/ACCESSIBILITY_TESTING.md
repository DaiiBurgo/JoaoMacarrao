# Guia de Testes de Acessibilidade

Este documento fornece diretrizes para testar a acessibilidade da aplicação.

## Índice

1. [Ferramentas de Teste](#ferramentas-de-teste)
2. [Checklist de Acessibilidade](#checklist-de-acessibilidade)
3. [Testes com Teclado](#testes-com-teclado)
4. [Testes com Leitores de Tela](#testes-com-leitores-de-tela)
5. [Testes de Contraste](#testes-de-contraste)
6. [Testes Automatizados](#testes-automatizados)
7. [Níveis de Conformidade WCAG](#níveis-de-conformidade-wcag)

---

## Ferramentas de Teste

### Ferramentas Online
- **WAVE** - https://wave.webaim.org/
- **axe DevTools** - Extensão para Chrome/Firefox
- **Lighthouse** - Integrado no Chrome DevTools
- **Color Contrast Analyzer** - https://www.tpgi.com/color-contrast-checker/

### Leitores de Tela
- **NVDA** (Windows) - Gratuito - https://www.nvaccess.org/
- **JAWS** (Windows) - Pago - https://www.freedomscientific.com/
- **VoiceOver** (macOS/iOS) - Integrado no sistema
- **TalkBack** (Android) - Integrado no sistema
- **ChromeVox** (Chrome) - Extensão gratuita

### Extensões do Navegador
```bash
# Chrome/Edge
- axe DevTools
- WAVE Evaluation Tool
- Accessibility Insights for Web
- Screen Reader

# Firefox
- axe DevTools
- WAVE Evaluation Tool
```

---

## Checklist de Acessibilidade

### ✅ Perceivível

#### Alternativas de Texto
- [ ] Todas as imagens têm atributo `alt` apropriado
- [ ] Imagens decorativas têm `alt=""` ou `role="presentation"`
- [ ] Ícones funcionais têm `aria-label`
- [ ] Gráficos e diagramas têm descrições textuais

#### Mídia Baseada em Tempo
- [ ] Vídeos têm legendas
- [ ] Vídeos têm audiodescrição quando necessário
- [ ] Áudio tem transcrição textual
- [ ] Player de LIBRAS está funcionando

#### Adaptável
- [ ] Conteúdo mantém sentido em diferentes orientações
- [ ] Layout responsivo funciona corretamente
- [ ] Ordem de leitura é lógica
- [ ] Estrutura semântica está correta (headings, landmarks)

#### Distinguível
- [ ] Contraste mínimo de 4.5:1 para texto normal
- [ ] Contraste mínimo de 3:1 para texto grande
- [ ] Modo de alto contraste funciona
- [ ] Cores não são a única forma de transmitir informação
- [ ] Áudio de fundo pode ser pausado ou controlado

### ✅ Operável

#### Acessível por Teclado
- [ ] Todos os elementos interativos são acessíveis por Tab
- [ ] Ordem de tabulação é lógica
- [ ] Não há armadilhas de foco (focus traps não intencionais)
- [ ] Atalhos de teclado estão documentados e funcionam
- [ ] Tecla Esc fecha modais e menus
- [ ] Enter/Space ativam botões

#### Tempo Suficiente
- [ ] Não há limites de tempo, ou eles podem ser ajustados
- [ ] Animações podem ser pausadas
- [ ] Auto-play pode ser desabilitado

#### Prevenção de Convulsões
- [ ] Nenhum elemento pisca mais de 3 vezes por segundo
- [ ] Animações respeitam `prefers-reduced-motion`

#### Navegável
- [ ] Links de navegação rápida (skip links) estão presentes
- [ ] Títulos de página são descritivos
- [ ] Ordem de foco é lógica
- [ ] Propósito dos links é claro pelo contexto
- [ ] Múltiplas formas de navegação estão disponíveis
- [ ] Breadcrumbs quando apropriado

#### Modalidades de Entrada
- [ ] Funciona com toque, mouse, teclado e voz
- [ ] Gestos não requerem precisão excessiva
- [ ] Botões têm área mínima de 44x44px

### ✅ Compreensível

#### Legível
- [ ] Idioma da página está definido (`lang` attribute)
- [ ] Mudanças de idioma estão marcadas
- [ ] Texto é claro e simples quando possível
- [ ] Modo de leitura simplificada funciona

#### Previsível
- [ ] Navegação é consistente entre páginas
- [ ] Componentes similares têm comportamento similar
- [ ] Mudanças de contexto não são inesperadas
- [ ] Foco não salta de forma imprevisível

#### Assistência de Entrada
- [ ] Erros de formulário são identificados
- [ ] Labels e instruções estão presentes
- [ ] Sugestões de correção são fornecidas
- [ ] Erros podem ser revertidos/corrigidos
- [ ] Confirmação antes de ações importantes

### ✅ Robusto

#### Compatível
- [ ] HTML válido e bem formado
- [ ] Atributos ARIA usados corretamente
- [ ] Funciona em diferentes navegadores
- [ ] Funciona com tecnologias assistivas

---

## Testes com Teclado

### Navegação Básica

```
Tab          → Move para o próximo elemento focável
Shift + Tab  → Move para o elemento anterior
Enter        → Ativa links e botões
Space        → Ativa botões, checkboxes, radio buttons
Esc          → Fecha modais, menus e popups
Arrow Keys   → Navega em menus, tabs, carousels
Home/End     → Vai para início/fim de lista ou documento
```

### Checklist de Teste com Teclado

1. **Navegação Sequencial**
   - [ ] Pressione Tab repetidamente
   - [ ] Verifique se todos os elementos interativos são alcançados
   - [ ] Verifique se a ordem é lógica
   - [ ] Confirme que o foco é visível

2. **Ativação de Elementos**
   - [ ] Teste Enter em links e botões
   - [ ] Teste Space em botões e checkboxes
   - [ ] Teste setas em select boxes e custom controls

3. **Modais e Overlays**
   - [ ] Tab deve circular apenas dentro do modal
   - [ ] Esc deve fechar o modal
   - [ ] Foco deve retornar ao elemento que abriu o modal

4. **Formulários**
   - [ ] Labels devem focar o input quando clicados
   - [ ] Mensagens de erro devem ser anunciadas
   - [ ] Enter em input de texto deve submeter o form

### Script de Teste

```javascript
// Execute no console do navegador
(function testKeyboardAccess() {
  const interactiveElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  console.log(`Total de elementos interativos: ${interactiveElements.length}`);
  
  interactiveElements.forEach((el, index) => {
    if (el.offsetParent === null) {
      console.warn(`Elemento ${index} não está visível:`, el);
    }
    if (!el.hasAttribute('aria-label') && !el.textContent.trim()) {
      console.warn(`Elemento ${index} pode não ter label adequado:`, el);
    }
  });
})();
```

---

## Testes com Leitores de Tela

### NVDA (Windows)

**Atalhos Básicos:**
```
NVDA + Espaço   → Liga/desliga modo foco
Insert + F7     → Lista de elementos
Insert + T      → Lê título da página
NVDA + Down     → Lê próximo item
NVDA + B        → Próximo botão
NVDA + H        → Próximo heading
```

**Processo de Teste:**
1. Abra a página
2. Pressione Insert + Down para navegar
3. Verifique se o conteúdo faz sentido na ordem lida
4. Teste navegação por headings (H)
5. Teste navegação por landmarks (D)
6. Verifique se imagens têm alt text apropriado
7. Teste formulários e mensagens de erro

### VoiceOver (macOS)

**Atalhos Básicos:**
```
Cmd + F5           → Ativar/desativar VoiceOver
VO + A             → Início da leitura
VO + Setas         → Navegar
VO + Espaço        → Ativar item
VO + H             → Próximo heading
VO + U             → Rotor (lista de elementos)
```

**Processo de Teste:**
1. Ative VoiceOver (Cmd + F5)
2. Use VO + A para começar a leitura
3. Use o rotor (VO + U) para navegar por tipo de elemento
4. Verifique descrições de imagens e links
5. Teste interações com formulários
6. Verifique anúncios de mudanças dinâmicas

### Checklist de Teste com Leitor de Tela

- [ ] Título da página é anunciado
- [ ] Headings são anunciados corretamente (h1, h2, etc.)
- [ ] Landmarks são identificados (main, nav, aside)
- [ ] Imagens têm texto alternativo apropriado
- [ ] Links têm texto descritivo
- [ ] Estado de elementos (expandido/colapsado, selecionado)
- [ ] Erros de formulário são anunciados
- [ ] Mudanças dinâmicas são anunciadas (via aria-live)
- [ ] Botões são identificados como botões
- [ ] Listas são identificadas com contagem de itens

---

## Testes de Contraste

### Ferramentas

1. **Chrome DevTools**
   - Inspecionar elemento
   - Clicar no seletor de cor
   - Verificar indicador de contraste

2. **Contrast Checker Online**
   ```
   https://webaim.org/resources/contrastchecker/
   ```

3. **Script de Teste**
   ```javascript
   // Verifica contraste de todos os textos
   (function checkContrast() {
     const elements = document.querySelectorAll('*');
     elements.forEach(el => {
       const style = window.getComputedStyle(el);
       const color = style.color;
       const bgColor = style.backgroundColor;
       console.log(`Element: ${el.tagName}`, { color, bgColor });
     });
   })();
   ```

### Requisitos Mínimos

| Tipo de Texto | Nível AA | Nível AAA |
|--------------|----------|-----------|
| Texto normal (< 18px) | 4.5:1 | 7:1 |
| Texto grande (≥ 18px) | 3:1 | 4.5:1 |
| Componentes UI | 3:1 | - |
| Elementos gráficos | 3:1 | - |

### Checklist

- [ ] Texto no fundo tem contraste mínimo de 4.5:1
- [ ] Títulos grandes têm contraste mínimo de 3:1
- [ ] Botões e controles têm contraste mínimo de 3:1
- [ ] Ícones têm contraste mínimo de 3:1
- [ ] Placeholders têm contraste adequado
- [ ] Modo de alto contraste oferece contraste ainda maior

---

## Testes Automatizados

### Setup com Jest e Testing Library

```bash
npm install --save-dev @axe-core/react jest-axe
```

```javascript
// setupTests.js
import 'jest-axe/extend-expect';

// example.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('deve não ter violações de acessibilidade', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Testes de Navegação por Teclado

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('deve navegar com Tab', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button1 = screen.getByRole('button', { name: 'Botão 1' });
  const button2 = screen.getByRole('button', { name: 'Botão 2' });
  
  await user.tab();
  expect(button1).toHaveFocus();
  
  await user.tab();
  expect(button2).toHaveFocus();
});

test('deve ativar botão com Enter', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Clique</button>);
  
  await user.tab();
  await user.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalled();
});
```

### Testes de ARIA

```javascript
test('deve ter labels ARIA apropriados', () => {
  render(<MyComponent />);
  
  expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Menu principal');
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
});
```

---

## Níveis de Conformidade WCAG

### Nível A (Mínimo)
- Requisitos básicos de acessibilidade
- Aplicação é utilizável com tecnologias assistivas

### Nível AA (Recomendado)
- Remove barreiras significativas
- Padrão para a maioria das regulamentações
- **Meta deste projeto**

### Nível AAA (Ótimo)
- Máximo nível de acessibilidade
- Pode não ser possível para todo o conteúdo

---

## Processo de Teste Completo

### 1. Preparação
```bash
# Instale as ferramentas necessárias
npm install --save-dev @axe-core/react jest-axe

# Execute a aplicação
npm run dev
```

### 2. Teste Automatizado
```bash
# Execute os testes
npm test

# Execute o Lighthouse
# Chrome DevTools > Lighthouse > Accessibility
```

### 3. Teste Manual com Teclado
- Desconecte o mouse
- Navegue apenas com teclado por 10 minutos
- Documente problemas encontrados

### 4. Teste com Leitor de Tela
- Ative NVDA ou VoiceOver
- Feche os olhos (se possível)
- Tente completar uma tarefa principal
- Documente problemas encontrados

### 5. Teste de Contraste
- Use a ferramenta de contraste do DevTools
- Verifique todos os estados (normal, hover, focus)
- Corrija valores abaixo do mínimo

### 6. Teste em Dispositivos Reais
- Teste no iPhone com VoiceOver
- Teste no Android com TalkBack
- Teste com magnificador de tela

### 7. Validação Final
- Execute todos os checklists acima
- Documente conformidade WCAG 2.1 AA
- Crie relatório de acessibilidade

---

## Problemas Comuns e Soluções

### Problema: Foco não visível
**Solução:** Adicionar estilos de foco personalizados
```css
*:focus {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

### Problema: Texto sem contraste
**Solução:** Ajustar cores para atingir 4.5:1
```css
color: #333333; /* Ao invés de #999999 */
```

### Problema: Imagem sem alt
**Solução:** Adicionar atributo alt apropriado
```jsx
<img src="logo.png" alt="Logo da Empresa" />
```

### Problema: Botão sem label
**Solução:** Adicionar aria-label
```jsx
<button aria-label="Fechar modal">×</button>
```

### Problema: Formulário sem labels
**Solução:** Associar labels com inputs
```jsx
<label htmlFor="email">E-mail:</label>
<input id="email" type="email" />
```

---

## Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility)
- [A11Y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Deque University](https://dequeuniversity.com/)

---

## Contato e Suporte

Para dúvidas sobre testes de acessibilidade:
- Consulte a documentação dos hooks em `frontend/src/hooks/README.md`
- Revise os exemplos em `frontend/src/examples/`
- Entre em contato com a equipe de acessibilidade

