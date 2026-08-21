# Família CEME

Site da Linha CEME (Corpo, Emoção, Mente e Espírito), com a aba de produtos, áudios, checkout com cartão e formulário de prescritoras. Baseado no pedido do cliente em [familiaceme.com.br](https://www.familiaceme.com.br).

## O que tem neste site

- Página inicial com fundadores, Método CEME, ferramentas e depoimentos
- Aba **Produtos** com os **15 biomoduladores** (60 ml), cada um com:
  - imagem da ficha
  - áudio em português
  - valor (R$ 120,00)
  - compra no site com cartão
- Carrinho com **pagamento com cartão no próprio site** (até 3x sem juros)
- Pedido pelo WhatsApp `(61) 99929-1377` continua disponível como alternativa
- Layout responsivo (celular, tablet e desktop)
- Formulário de distribuidora/prescritora que preenche e envia pelo WhatsApp
- Seletor de idiomas: **Português / English / Español / Deutsch** (PT · EN · ES · DE)

## Pagamento com cartão

O checkout pede dados de entrega e o cartão na própria página. Os preços são calculados de novo no servidor (o cliente não consegue mudar o valor).

Enquanto o Mercado Pago não estiver ligado, o site roda em **modo demonstração**: o fluxo completo aparece, mas nenhum valor é cobrado. Cartão de teste: `4111 1111 1111 1111`, validade futura e CVV `123`.

Para receber pagamentos de verdade:

1. Crie uma aplicação em [Mercado Pago Developers](https://www.mercadopago.com.br/developers).
2. Copie a **chave pública** e o **Access Token**.
3. Publique a API da pasta `server/` (Render, Railway ou similar) com as variáveis do `server/.env.example`.
4. Em `checkout-config.js`, coloque a URL da API em `apiUrl`.
5. No servidor, deixe `DEMO_PAYMENTS=false`.

A API não deve ir para o GitHub Pages. O site estático chama só o endereço público da API.

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

Para testar a API de pagamento:

```bash
cd server
cp .env.example .env
npm install
npm test
npm start
```
