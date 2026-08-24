# Família CEME

Loja da Linha CEME (Corpo, Emoção, Mente e Espírito): catálogo, carrinho e checkout no próprio site. Baseado no pedido do cliente em [familiaceme.com.br](https://www.familiaceme.com.br).

## O que tem neste site

- Página inicial com fundadores, Método CEME, ferramentas e depoimentos
- Aba **Produtos** com os **15 moduladores biofísicos** (60 ml), cada um com imagem, áudio e valor
- Mapa Holográfico, Garrafadas em Cápsula e álbum digital no mesmo carrinho
- Checkout no site: dados, entrega (Correios ou retirada em Brasília) e pagamento com **Pix** ou **cartão** (até 3x sem juros)
- Frete calculado pelo CEP, com **frete grátis** a partir de R$ 360 e retirada gratuita na sede
- WhatsApp `(61) 99929-1377` continua como alternativa no carrinho e no formulário de prescritora
- Layout responsivo (celular, tablet e desktop)
- Seletor de idiomas: **Português / English / Español / Deutsch / Français** (PT · EN · ES · DE · FR)

## Como abrir localmente

Abra o `index.html` no navegador ou, na pasta do projeto:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

Para testar o checkout em modo demonstração:

1. Adicione um produto e clique em **Finalizar compra**
2. Preencha os dados (CPF de teste: `529.982.247-25`)
3. Cartão: `4111 1111 1111 1111`, validade futura e CVV `123`
4. Ou gere um Pix e clique em **Já paguei o Pix**

Nenhum valor é cobrado até o Mercado Pago ser conectado.

## Pagamento real (Mercado Pago)

O GitHub Pages serve só o site estático. A cobrança fica na API da pasta `server/`.

```bash
cd server
npm install
npm test
```

1. Crie o app no [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Publique `server/` (Render/Railway) com `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY` e `DEMO_PAYMENTS=false`
3. Coloque a URL da API em `checkout-config.js` (`apiUrl`)

## Publicar (GitHub Pages)

O site estático pode ficar online em:

`https://gabriel7z.github.io/Site/`

**Passos (uma vez):**
1. No GitHub: **Settings → General → Danger Zone** — deixe o repositório **público** (necessário no plano Free).
2. **Settings → Pages → Build and deployment → Source**: escolha **GitHub Actions**.
3. Faça push em `main` (ou rode o workflow **Deploy GitHub Pages** manualmente).
