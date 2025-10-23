# 🎨 Guia Visual - João Macarrão

## Paleta de Cores em Ação

### 🟡 Amarelo Massa (#FFC300)
**Uso:** Botões primários, logo "João", destaques importantes
```html
<button class="btn btn-primary">Ver Cardápio</button>
<h1 class="text-primary">Título Importante</h1>
```

### 🔴 Vermelho Molho (#E63946)
**Uso:** Logo "Macarrão", títulos de seção, preços
```html
<h2 class="section-title">Pratos em Destaque</h2>
<span class="price-value">R$ 48,90</span>
```

### 🌊 Azul Profundo (#004E7C)
**Uso:** Botões de áudio, links, elementos marinhos
```html
<button class="btn-audio">🔊 Ouvir</button>
```

### 🟠 Coral Quente (#FF6B35)
**Uso:** Botões de vídeo, hover states, elementos de destaque
```html
<button class="btn-coral">Ver no Mapa</button>
```

### 🌿 Verde Salsa (#6A994E)
**Uso:** Feedback de sucesso, WhatsApp
```html
<button class="btn btn-whatsapp">Peça pelo WhatsApp</button>
```

---

## 📦 Componentes

### Navbar
```tsx
import Navbar from './components/Navbar';

<Navbar cartItemCount={3} />
```

**Features:**
- Logo animado com hover
- Menu responsivo (hamburguer em mobile)
- Contador de carrinho com badge pulsante
- Botão WhatsApp sempre visível
- Acessibilidade completa

---

### DishCard
```tsx
import DishCard from './components/DishCard';

const dish = {
  id: 1,
  name: 'Espaguete ao Frutos do Mar',
  description: 'Massa fresca com camarões, lulas e mexilhões',
  price: 48.90,
  category: 'Massas',
  rating: 5,
  prepTime: '25 min',
  image: '/path/to/image.jpg'
};

<DishCard
  dish={dish}
  onAddToCart={(dish) => console.log('Adicionado:', dish)}
  onPlayAudio={(text) => console.log('Narrar:', text)}
  onPlayVideo={(id) => console.log('Vídeo:', id)}
/>
```

**Features:**
- 3 botões interativos (Ouvir, Vídeo, Adicionar)
- Badges de categoria e tempo
- Sistema de avaliação com estrelas
- Animações de hover e click
- Imagem com efeito zoom on hover

---

### Footer
```tsx
import Footer from './components/Footer';

<Footer />
```

**Features:**
- Logo completo
- Links de redes sociais
- Informações de contato
- Horário de funcionamento
- Onda decorativa animada
- Links úteis no bottom bar

---

## 🎬 Animações

### Fade In
```html
<div class="animate-fade-in">
  Conteúdo que aparece suavemente
</div>
```

### Float (Flutuação)
```html
<span class="animate-float">🍝</span>
```

### Glow (Brilho)
```html
<button class="btn btn-primary animate-glow">
  Destaque Especial
</button>
```

### Bubble (Bolha)
```html
<!-- Animação automática ao adicionar item -->
<button class="btn-add-to-cart adding">
  Adicionado!
</button>
```

---

## 🎨 Texturas e Efeitos

### Textura de Madeira
```html
<div class="texture-wood bg-cream p-4">
  Conteúdo com textura de madeira clara
</div>
```

### Padrão de Massas
```html
<section class="pattern-pasta">
  Seção com padrão decorativo de massas
</section>
```

### Padrão de Ondas
```html
<div class="pattern-waves gradient-ocean">
  Elemento com tema marinho
</div>
```

### Gradiente Sunset
```html
<div class="gradient-sunset p-4 text-white">
  Fundo com gradiente pôr do sol
</div>
```

---

## 🖼️ Layout Examples

### Hero Section
```html
<section class="hero-section">
  <div class="hero-content">
    <h1 class="hero-title animate-fade-in">
      Título Principal
    </h1>
    <p class="hero-subtitle animate-fade-in">
      Subtítulo elegante
    </p>
    <div class="hero-actions animate-fade-in">
      <button class="btn btn-primary btn-lg">CTA Primário</button>
      <button class="btn btn-outline btn-lg">CTA Secundário</button>
    </div>
  </div>
</section>
```

### Grid de Pratos
```html
<div class="dishes-grid">
  <DishCard dish={dish1} />
  <DishCard dish={dish2} />
  <DishCard dish={dish3} />
</div>
```

### Seção com Fundo Escuro
```html
<section class="video-section bg-dark">
  <div class="container">
    <h2 class="video-title">Título da Seção</h2>
    <p class="video-description">Descrição...</p>
  </div>
</section>
```

---

## 🎯 Botões

### Tamanhos
```html
<button class="btn btn-primary btn-sm">Pequeno</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

### Variações
```html
<!-- Primário (Amarelo Massa) -->
<button class="btn btn-primary">Primário</button>

<!-- Secundário (Vermelho Molho) -->
<button class="btn btn-secondary">Secundário</button>

<!-- Coral -->
<button class="btn btn-coral">Coral</button>

<!-- WhatsApp -->
<button class="btn btn-whatsapp">WhatsApp</button>

<!-- Outline -->
<button class="btn btn-outline">Outline</button>
```

### Com Ícones
```html
<button class="btn btn-primary">
  <ShoppingCart size={20} />
  <span>Adicionar</span>
</button>
```

---

## 📱 Responsividade

### Classes Utilitárias
```html
<!-- Container responsivo -->
<div class="container">
  Conteúdo centralizado com padding automático
</div>

<!-- Grid adaptativo -->
<div class="dishes-grid">
  <!-- 3 colunas em desktop, 1 em mobile -->
</div>

<!-- Flex utilities -->
<div class="flex items-center justify-between gap-2">
  Flexbox responsivo
</div>
```

### Breakpoints
- **Mobile:** até 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

---

## ♿ Acessibilidade

### Skip Link
```html
<a href="#main-content" class="skip-link sr-only-focusable">
  Pular para o conteúdo principal
</a>
```

### ARIA Labels
```html
<button 
  aria-label="Adicionar Espaguete ao carrinho"
  aria-describedby="dish-description"
>
  Adicionar
</button>
```

### Focus Visible
Todos os elementos interativos têm foco visível automático:
```css
button:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 🎨 Customização

### Variáveis CSS
Todas as variáveis podem ser sobrescritas:

```css
:root {
  --color-primary: #FFC300;
  --color-secondary: #E63946;
  --spacing-md: 1rem;
  --radius-lg: 0.75rem;
  /* etc... */
}
```

### Theme TypeScript
```typescript
import { theme } from './theme';

const MyComponent = () => {
  return (
    <div style={{ 
      color: theme.colors.primary.main,
      padding: theme.spacing.lg 
    }}>
      Conteúdo
    </div>
  );
};
```

---

## 🚀 Quick Start

### 1. Importe os estilos
```tsx
// App.tsx
import './styles/theme.css';
import './styles/animations.css';
import './styles/rustic-textures.css';
```

### 2. Use os componentes
```tsx
import Navbar from './components/Navbar';
import DishCard from './components/DishCard';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <DishCard dish={myDish} />
      </main>
      <Footer />
    </>
  );
}
```

### 3. Adicione animações
```html
<div class="animate-fade-in">
  Conteúdo animado
</div>
```

### 4. Aplique texturas
```html
<section class="texture-linen pattern-pasta">
  Seção com toque artesanal
</section>
```

---

## 💡 Dicas de Uso

### ✅ DO (Faça)
- Use as variáveis CSS para manter consistência
- Aplique classes de animação com moderação
- Teste em diferentes dispositivos
- Verifique contraste de cores
- Use ARIA labels em elementos interativos
- Mantenha hierarquia de títulos (h1, h2, h3)

### ❌ DON'T (Não Faça)
- Não adicione cores fora da paleta oficial
- Não abuse de animações (pode causar distração)
- Não esqueça de testar com leitores de tela
- Não use apenas cores para transmitir informação
- Não ignore os breakpoints definidos
- Não use inline styles desnecessariamente

---

## 🎉 Exemplos Práticos

### Página de Produto
```tsx
<div className="container">
  <div className="dish-detail">
    <img src={dish.image} alt={dish.name} />
    <div className="dish-info">
      <h1 className="text-secondary">{dish.name}</h1>
      <p className="dish-description">{dish.description}</p>
      <div className="price-section">
        <span className="price-value">
          {formatPrice(dish.price)}
        </span>
      </div>
      <button className="btn btn-primary btn-lg animate-bubble">
        Adicionar ao Carrinho
      </button>
    </div>
  </div>
</div>
```

### Card de Categoria
```html
<div class="card texture-linen">
  <div class="card-body">
    <h3 class="card-title">Massas Frescas</h3>
    <p class="card-text">
      Feitas diariamente com ingredientes selecionados
    </p>
    <button class="btn btn-coral">Ver Pratos</button>
  </div>
</div>
```

### Banner Promocional
```html
<div class="gradient-sunset p-4 text-center animate-fade-in">
  <h2 class="text-white">Promoção Especial!</h2>
  <p class="text-white">25% de desconto em massas frescas</p>
  <button class="btn btn-primary btn-lg">
    Aproveite Agora
  </button>
</div>
```

---

## 📚 Recursos Adicionais

- **Paleta Completa:** Ver `theme.ts`
- **Todas as Animações:** Ver `animations.css`
- **Texturas Disponíveis:** Ver `rustic-textures.css`
- **Componentes:** Ver pasta `components/`
- **Exemplos:** Ver `HomePage.tsx`

---

**Desenvolvido com ❤️ para o João Macarrão**

*Sabor artesanal do litoral — tecnologia que dá água na boca.*

