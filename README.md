# Família CEME

Site da Linha CEME (Corpo, Emoção, Mente e Espírito), com a aba de produtos, áudios e formulário de prescritoras. Baseado no pedido do cliente em [familiaceme.com.br](https://www.familiaceme.com.br).

## O que tem neste site

- Página inicial com fundadores, Método CEME, ferramentas e depoimentos
- Aba **Produtos** com os **15 moduladores biofísicos** (60 ml), cada um com:
  - imagem da ficha
  - áudio em português
  - valor (R$ 120,00)
  - compra pelo WhatsApp
- Carrinho simples com finalização no WhatsApp `(61) 99929-1377`
- Layout responsivo (celular, tablet e desktop)
- Formulário de distribuidora/prescritora que preenche e envia pelo WhatsApp
- Seletor de idiomas: **Português / English / Español / Deutsch** (PT · EN · ES · DE)

## Publicar (GitHub Pages)

O site é estático e pode ficar online em:

`https://gabriel7z.github.io/Site/`

**Passos (uma vez):**
1. No GitHub: **Settings → General → Danger Zone** — deixe o repositório **público** (necessário no plano Free).
2. **Settings → Pages → Build and deployment → Source**: escolha **GitHub Actions**.
3. Faça push em `main` (ou rode o workflow **Deploy GitHub Pages** manualmente).

## Como abrir localmente

Abra o `index.html` no navegador ou, na pasta do projeto:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.
