# Passar a loja para o dono

O código da CEME já está neste repositório. Daqui **não** dá para criar a conta Mercado Pago, Render ou GitHub dele — isso só ele faz, logado no nome dele.

Marca da CEME (WhatsApp, endereço, YouTube, `familiaceme.com.br`) **já está no site**. Não mexe.

## O que vocês NÃO copiam da conta de teste

- Access Token / Public Key (`TEST-` ou `APP_USR-`)
- `DATABASE_URL`
- senha de app do Gmail
- senha `ADMIN_KEY` de teste

Cada um desses nasce **na conta dele**.

## 1. GitHub (conta dele)

1. No repositório atual: **Settings → General → Transfer ownership** para o usuário ou organização dele.
2. **Settings → Pages → Source**: GitHub Actions.
3. Repositório **público** (Pages no plano Free).
4. Anote a URL nova, no formato `https://USUARIO.github.io/Site/`.

## 2. Mercado Pago (conta dele, a que recebe o dinheiro)

1. Login na conta **Família CEME** (não na de teste).
2. [Suas integrações](https://www.mercadopago.com.br/developers/panel/app) → app **Checkout Pro**.
3. **Credenciais de produção** (`APP_USR-`). Cadastre o site da etapa 1 (ou o domínio, se tiverem).
4. Webhook: `https://ceme-checkout.onrender.com/api/webhooks/mercadopago` — se o Render dele tiver outro nome, use essa URL nova.
5. Guarde o **segredo do webhook**. Não cola no GitHub nem no chat.

## 3. Render (conta dele)

1. [Blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance** → este repositório → **Apply**.
2. Isso cria o site `ceme-checkout` (sempre ligado) e o Postgres. O `DATABASE_URL` entra sozinho.
3. No serviço, em **Environment**, ele cola **só no painel**:

```
MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...
MP_WEBHOOK_SECRET=...
DEMO_PAYMENTS=false
MP_TEST_MODE=false
PUBLIC_SITE_URL=https://USUARIO.github.io/Site
ALLOWED_ORIGINS=https://USUARIO.github.io
ADMIN_KEY=uma-senha-nova-só-da-loja
GMAIL_USER=email-da-loja
GMAIL_APP_PASSWORD=senha-de-app-do-gmail
```

4. Se o Render não deixar o nome `ceme-checkout` (já usado na conta de teste), o serviço nascerá com outro endereço. Aí é a linha da etapa 4.

## 4. Uma linha no código

Arquivo `checkout-config.js`, no topo:

```js
const RENDER_API_URL = "https://ceme-checkout.onrender.com";
```

Troque pela URL do Render **dele**, se for diferente. Commit e push em `main`. O GitHub Pages atualiza sozinho.

## 5. Conferir

`https://ceme-checkout.onrender.com/api/health` (ou a URL nova) tem que mostrar:

- `"storage":"postgres"`
- `"sandbox":false`
- `"mode":"live"`

Uma compra de teste na conta **dele**: o pedido vira `CEME-1` em `envios.html` com a senha `ADMIN_KEY` nova.

Pronto: daqui em diante só as contas dele cobram, hospedam e guardam histórico.
