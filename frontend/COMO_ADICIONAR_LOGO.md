# 🎨 Como Adicionar a Logo

## Passo 1: Converter o PDF para PNG

Você tem 3 opções para converter o arquivo `LOGOTIPO_JOAO_MACARRAO.pdf` para PNG:

### Opção A: Online (Mais Rápido) ⚡
1. Acesse: https://www.ilovepdf.com/pt/pdf_para_jpg
2. Faça upload do arquivo `src/LOGOTIPO_JOAO_MACARRAO.pdf`
3. Converta para JPG/PNG
4. Baixe a imagem

### Opção B: Windows (Sem instalar nada) 💻
1. Abra o PDF no navegador (Edge, Chrome, etc)
2. Pressione `Ctrl + P` (Imprimir)
3. Escolha "Microsoft Print to PDF" ou "Save as PDF"
4. Tire um print da tela (`Win + Shift + S`)
5. Cole no Paint e salve como PNG

### Opção C: Photoshop / GIMP 🎨
1. Abra o PDF no Photoshop ou GIMP
2. Exporte como PNG
3. Resolução recomendada: 200x200px (mínimo) ou 500x500px (ideal)

## Passo 2: Preparar a Imagem

- **Formato:** PNG (recomendado para logo com fundo transparente)
- **Tamanho:** 500x500px ou maior (será redimensionado automaticamente)
- **Nome:** `logo.png`

## Passo 3: Colocar no Projeto

Copie a imagem para:
```
C:\Users\Nilson\JoaoMacarrao\frontend\public\assets\logo.png
```

## Passo 4: Testar

1. Recarregue a página no navegador (`Ctrl + Shift + R`)
2. A logo deve aparecer no canto superior esquerdo
3. Ao passar o mouse, ela deve girar levemente

## ✨ Pronto!

Se a logo não aparecer, verifique:
- [ ] O arquivo está no caminho correto?
- [ ] O nome é exatamente `logo.png`?
- [ ] Você recarregou a página?

---

**Nota:** Se quiser usar um formato diferente (JPG, SVG), atualize a linha 32 do arquivo:
`frontend/src/components/Navbar.tsx`

