# 🍝 João Macarrão - Frontend

> **Massas Artesanais e Frutos do Mar com o Sabor do Litoral**

Interface moderna, acessível e responsiva para o restaurante João Macarrão, desenvolvida com React, TypeScript e focada em experiência do usuário e acessibilidade.

---

## 🎨 Fase 8 - Identidade Visual Implementada

Esta aplicação implementa a **Fase 8: Identidade Visual e UI Refinada** com:

- ✅ Paleta de cores oficial (Amarelo Massa + Vermelho Molho + Azul Profundo)
- ✅ Tipografia personalizada (Baloo 2 + Poppins + Playfair Display)
- ✅ Componentes modernos e reutilizáveis
- ✅ Animações sutis e feedback sensorial
- ✅ Texturas artesanais e toque praiano
- ✅ 100% responsivo (mobile-first)
- ✅ Acessibilidade WCAG 2.1 AA

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 📦 Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Gera build de produção
npm run preview    # Preview do build de produção
npm run lint       # Verifica erros de código
npm test           # Executa testes
npm run test:ui    # Testes com interface visual
```

---

## 🎨 Paleta de Cores

| Cor | Nome | Hex | Uso |
|-----|------|-----|-----|
| 🟡 | Amarelo Massa | `#FFC300` | Botões primários, destaques |
| 🔴 | Vermelho Molho | `#E63946` | Títulos, preços |
| ⚫ | Antracite Marinho | `#1A1A1D` | Fundo escuro |
| 🟠 | Coral Quente | `#FF6B35` | Ações secundárias |
| 🌊 | Azul Profundo | `#004E7C` | Links, elementos marinhos |
| 🤍 | Creme Claro | `#FFF5E4` | Fundo claro, cards |
| 🌿 | Verde Salsa | `#6A994E` | Sucesso, WhatsApp |

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Navbar.tsx
│   │   ├── DishCard.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/          # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── CartPage.tsx
│   │   └── ...
│   ├── styles/         # Estilos CSS
│   │   ├── theme.css
│   │   ├── animations.css
│   │   ├── rustic-textures.css
│   │   └── ...
│   ├── hooks/          # Custom React Hooks
│   ├── contexts/       # React Contexts
│   ├── services/       # Serviços e APIs
│   ├── stores/         # Zustand stores
│   ├── types/          # TypeScript types
│   ├── theme.ts        # Tema TypeScript
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🧩 Componentes Principais

### Navbar
Menu de navegação responsivo com logo, links e botão WhatsApp
```tsx
<Navbar cartItemCount={3} />
```

### DishCard
Card de prato com imagem, descrição, preço e botões interativos
```tsx
<DishCard 
  dish={dish}
  onAddToCart={handleAdd}
  onPlayAudio={handleAudio}
  onPlayVideo={handleVideo}
/>
```

### Footer
Rodapé completo com informações de contato e redes sociais
```tsx
<Footer />
```

---

## ♿ Acessibilidade

### Recursos Implementados

- ✅ **Navegação por teclado** completa
- ✅ **Screen readers** suportados (NVDA, JAWS, VoiceOver)
- ✅ **Alto contraste** disponível
- ✅ **Leitura simplificada** para dislexia
- ✅ **Text-to-Speech** integrado
- ✅ **LIBRAS** (via VLibras)
- ✅ **Skip links** para conteúdo principal
- ✅ **ARIA labels** em todos os elementos
- ✅ **Contraste WCAG 2.1 AA** (mínimo 4.5:1)
- ✅ **Touch targets** adequados (44px mínimo)
- ✅ **Reduced motion** para usuários sensíveis

### Toolbar de Acessibilidade
```tsx
<AccessibilityToolbar />
```
Permite ao usuário:
- Aumentar/diminuir fonte
- Ativar alto contraste
- Ativar leitura simplificada
- Ouvir conteúdo (TTS)
- Ver em LIBRAS

---

## 📱 Responsividade

### Breakpoints
- **xs:** 320px (mobile pequeno)
- **sm:** 640px (mobile)
- **md:** 768px (tablet)
- **lg:** 1024px (desktop pequeno)
- **xl:** 1280px (desktop)
- **2xl:** 1536px (desktop grande)

Todos os componentes são **mobile-first** e testados em:
- iPhone SE, 12, 13, 14
- Samsung Galaxy S20, S21
- iPad, iPad Pro
- Desktops de várias resoluções

---

## 🎬 Animações

Biblioteca completa de animações disponível:

```html
<div class="animate-fade-in">Fade In</div>
<div class="animate-float">Float</div>
<div class="animate-bubble">Bubble</div>
<div class="animate-glow">Glow</div>
```

**Nota:** Todas as animações respeitam `prefers-reduced-motion`.

---

## 🎨 Texturas Artesanais

Texturas disponíveis para criar o toque rústico:

```html
<div class="texture-wood">Madeira clara</div>
<div class="texture-linen">Linho</div>
<div class="pattern-pasta">Padrão de massas</div>
<div class="pattern-waves">Ondas do mar</div>
```

---

## 🔧 Tecnologias

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento

### State Management
- **Zustand** - State management simples

### UI/UX
- **Lucide React** - Ícones modernos
- **React Toastify** - Notificações elegantes

### Forms
- **React Hook Form** - Formulários performáticos

### Payment
- **Stripe** - Processamento de pagamentos

### Data Visualization
- **Recharts** - Gráficos para dashboard admin

### QR Code
- **React QR Code Logo** - Geração de QR codes

---

## 🌐 Integração com Backend

O frontend está configurado para se conectar com o backend Django:

```typescript
// Proxy configurado no vite.config.ts
proxy: {
  '/api': 'http://localhost:8000',
  '/media': 'http://localhost:8000'
}
```

### Serviços disponíveis:
- `api.ts` - Cliente HTTP base
- `order.service.ts` - Gerenciamento de pedidos
- `payment.service.ts` - Processamento de pagamentos
- `review.service.ts` - Sistema de avaliações
- `contact.service.ts` - Formulário de contato
- `admin.service.ts` - Dashboard administrativo

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com coverage
npm run test:coverage
```

---

## 📚 Documentação Adicional

- [README_FASE8.md](./README_FASE8.md) - Documentação completa da Fase 8
- [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Guia visual de componentes
- [ACCESSIBILITY_SUMMARY.md](./ACCESSIBILITY_SUMMARY.md) - Recursos de acessibilidade
- [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) - Como testar acessibilidade

---

## 🚢 Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

### Plataformas Suportadas
- **Netlify** (configurado via `netlify.toml`)
- **Vercel** (configurado via `vercel.json`)
- **Render**
- Qualquer servidor de arquivos estáticos

---

## 🐛 Solução de Problemas

### Porta 3000 já em uso
```bash
# Use outra porta
npm run dev -- --port 3001
```

### Erros de TypeScript
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Build falhando
```bash
# Verifique erros de linting primeiro
npm run lint
```

---

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Code Style
- Use TypeScript para novos arquivos
- Siga as regras do ESLint
- Adicione tipos para todas as props
- Escreva testes para novos componentes

---

## 📄 Licença

Este projeto é privado e pertence ao João Macarrão.

---

## 👨‍💻 Desenvolvido por

**João Macarrão Dev Team**

---

## 📞 Suporte

- 📧 Email: contato@joaomacarrao.com.br
- 📱 WhatsApp: (11) 9999-9999
- 🌐 Site: www.joaomacarrao.com.br

---

## 🎉 Status do Projeto

✅ **Fase 8 - Identidade Visual** - Completa
- [x] Paleta de cores implementada
- [x] Tipografia customizada
- [x] Componentes principais criados
- [x] Página inicial desenvolvida
- [x] Animações e texturas adicionadas
- [x] Responsividade garantida
- [x] Acessibilidade implementada

### Próximas Fases
- [ ] Integração completa com backend
- [ ] Sistema de pagamentos
- [ ] Dashboard administrativo
- [ ] Otimizações de performance
- [ ] Testes E2E

---

**🍝 Sabor artesanal do litoral — tecnologia que dá água na boca.**

---

*Última atualização: Fase 8 - Identidade Visual e UI Refinada*

