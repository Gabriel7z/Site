# Família CEME

Loja da Linha CEME (Corpo, Emoção, Mente e Espírito): catálogo, carrinho e checkout no próprio site. Baseado no pedido do cliente em [familiaceme.com.br](https://www.familiaceme.com.br).

## O que tem neste site

- Página inicial com fundadores, Método CEME, ferramentas e depoimentos
- Aba **Produtos** com os **15 moduladores biofísicos** (60 ml), cada um com imagem, áudio e valor
- Mapa Holográfico, Garrafadas em Cápsula e álbum digital no mesmo carrinho
- Checkout no site: dados, entrega (Correios ou retirada em Brasília) e redirecionamento ao **Checkout Pro**
- Frete **grátis neste teste** (produtos a **R$ 0,10** para validar o Mercado Pago)
- WhatsApp `(61) 99929-1377` continua como alternativa no carrinho e no formulário de prescritora
- Layout responsivo (celular, tablet e desktop)
- Pagamento no **Mercado Pago** (Pix, cartão e boleto no site deles; o cartão não passa pela CEME)
- Cada compra vira um **pedido identificado** (`CEME-1`, `CEME-2`…) com nome, itens e endereço para postar certo. O cliente acompanha em `pedidos.html`. A loja vê a lista em `envios.html` (senha `ADMIN_KEY`). **Não há** cadastro de membros nem clube de promoção. O histórico fica no **Postgres do Render** (`DATABASE_URL`). Sem banco, o arquivo local some no restart do serviço.

## Como abrir no seu computador

O endereço **não** é só `localhost`. Tem que ter a porta **3001**:

**http://127.0.0.1:3001**

1. Abra a pasta do projeto no terminal
2. Rode:

```bash
bash abrir-local.sh
```

Ou, sem o script:

```bash
cd server && npm install && npm start
```

3. No navegador, cole `http://127.0.0.1:3001` ou `http://localhost:3001`

`http://localhost` **sem a porta** não abre — a loja não está na porta 80.

Ainda mais simples para só ver o catálogo: dê dois cliques em `index.html`. Sem o script, o checkout fica em modo demonstração no próprio navegador.

Para testar o checkout com a API de teste:

1. Adicione um produto e clique em **Finalizar compra**
2. O banner deve mostrar **API de teste ligada**
3. Preencha os dados (CPF de teste: `529.982.247-25`) e aceite a política
4. Clique em **Pagar no Mercado Pago** — em demonstração o site simula o retorno, sem cobrança

Nenhum valor é cobrado até as chaves `APP_USR-` (ou `TEST-`) estarem no `server/.env` (nunca no chat).

## Teste na sua conta (R$ 0,10)

Os produtos estão a **R$ 0,10** e o frete de teste está grátis.

1. Crie o app **Checkout Pro** em [Suas integrações](https://www.mercadopago.com.br/developers/panel/app)
2. Cole **só no arquivo** `server/.env` (não manda no WhatsApp nem no Cursor):

```
MP_ACCESS_TOKEN=TEST-...   # ou APP_USR- se for cobrança real de 10 centavos
MP_PUBLIC_KEY=TEST-...
DEMO_PAYMENTS=false
MP_TEST_MODE=true
```

Com `APP_USR-` use `MP_TEST_MODE=false` — cai **R$ 0,10 de verdade** na sua conta.

3. Pare o servidor (Ctrl+C) e rode de novo: `bash abrir-local.sh`
4. Abra **http://127.0.0.1:3001**, compre 1 item, pague no Mercado Pago
5. Confira o pedido em `envios.html` (senha `ceme-local`)

Com token `TEST-`, no Checkout Pro use comprador de teste e o cartão Visa `4235 6477 2802 5682`, validade `11/30`, CVV `123`, nome `APRO`.

## API de teste

`abrir-local.sh` sobe a loja e a API **juntos** em `http://127.0.0.1:3001`.

Para o sandbox real do Mercado Pago (ainda sem cobrança):

1. Crie o app em [Suas integrações](https://www.mercadopago.com.br/developers/panel/app)
2. Copie as **credenciais de teste** (Access Token e Public Key, prefixo `TEST-`)
3. Cole em `server/.env`:

```
MP_ACCESS_TOKEN=TEST-...
MP_PUBLIC_KEY=TEST-...
DEMO_PAYMENTS=false
MP_TEST_MODE=true
```

4. Reinicie `npm start` na pasta `server/`
5. No Checkout Pro de teste, use um [comprador de teste](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/test/accounts) e o cartão Visa `4235 6477 2802 5682`, validade `11/30`, CVV `123`, nome `APRO`

## Como o dinheiro cai na conta Mercado Pago

O dinheiro **não** cai no GitHub. Ele cai na **conta Mercado Pago em que você estiver logado** ao copiar as chaves de **produção**. Entre com a conta da Família CEME (a que recebe as vendas), não uma conta pessoal de teste.

1. Abra [Suas integrações](https://www.mercadopago.com.br/developers/panel/app) e faça login na conta que deve receber o dinheiro.
2. Crie um aplicativo (se ainda não tiver). Produto: **Checkout Pro**.
3. No menu esquerdo, abra **Credenciais de produção** (não as de teste).
4. Ative as credenciais: informe o ramo de atividade e o site (`https://gabriel7z.github.io/Site/` ou o domínio da loja).
5. Copie o par de **produção**:
   - **Access Token** começa com `APP_USR-` (chave secreta da API — nunca cola no GitHub, no `checkout-config.js` nem no chat)
   - **Public Key** também começa com `APP_USR-` (o Checkout Pro usa principalmente o Access Token no servidor)
6. Chave que começa com `TEST-` **não cobra** e o dinheiro **não cai**. Isso é só laboratório.
7. A API precisa estar **online** (Render, Railway ou similar). O GitHub Pages só serve o HTML e não consegue cobrar.
8. Na hospedagem da API, coloque as variáveis (nunca no repositório):

```
MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...
DEMO_PAYMENTS=false
MP_TEST_MODE=false
PUBLIC_SITE_URL=https://gabriel7z.github.io/Site
ALLOWED_ORIGINS=https://gabriel7z.github.io
```

9. No site, em `checkout-config.js`, cole a URL pública da API em `apiUrl` (exemplo: `https://sua-api.onrender.com`).
10. Crie um **PostgreSQL no mesmo Render** da API e cole a Internal Database URL só no painel, em `DATABASE_URL`. Sem isso a lista de envios some quando o serviço dorme. Não cole a URI no GitHub nem no chat.
11. Depois da venda aprovada, o valor aparece no [Mercado Pago](https://www.mercadopago.com.br) daquela conta. De lá vocês transferem para o banco.

## Histórico de pedidos (Postgres no Render)

A API já está no Render. O banco também fica **lá** — um painel, uma conta. Não use outro serviço de banco.

O disco do web service some quando o serviço dorme. Por isso o arquivo `server/data/orders.json` **não** serve para produção.

1. No [Render](https://dashboard.render.com), na mesma conta do `ceme-checkout`: **New → PostgreSQL**. O plano mais barato serve.
2. Copie a **Internal Database URL** (é a de dentro da rede do Render, não a External).
3. Abra o serviço `ceme-checkout` → **Environment** → **Add** `DATABASE_URL` = essa URL.
4. **Manual Deploy** do `ceme-checkout`.
5. Abra `https://ceme-checkout.onrender.com/api/health` — tem que aparecer `"storage":"postgres"`. Se continuar `"file"`, a variável não entrou.

Os números recomeçam em **CEME-1** neste banco novo. Não cole a URI, senha ou token neste repositório.

A conta Mercado Pago precisa estar verificada (documento e, para sacar, dados bancários). Taxas do MP saem de cada venda aprovada (Pix, cartão etc.).

**Não envie o Access Token** para ninguém. Se vazar, renove as credenciais no painel.

## MCP oficial do Mercado Pago (Cursor)

O arquivo `.cursor/mcp.json` já aponta para o servidor oficial:

`https://mcp.mercadopago.com/mcp`

Isso **não** cobra sozinho. O MCP só funciona no **Cursor no seu computador**, depois de você autorizar a conta Mercado Pago da CEME.

**Como ligar (você precisa fazer uma vez):**

1. Abra esta pasta no [Cursor Desktop](https://cursor.com/download) (não no agente na nuvem).
2. Vá em **Settings → Tools & MCP**.
3. Em **mercadopago-mcp-server**, clique em **Connect**.
4. Escolha o país **Brasil** e autorize o app **Cursor** na tela do Mercado Pago.
5. Volte a este chat **no Cursor Desktop** e diga: *“usa o MCP do Mercado Pago: cria o app Checkout Pro, pega as credenciais e configura o webhook”*.

No Cursor na nuvem (este ambiente) o MCP **ainda não aparece** nas ferramentas — o OAuth tem que ser no seu login. Depois de Connect, o agente no Desktop pode criar o aplicativo, ler credenciais de teste, medir qualidade e consultar a documentação sem você colar token no chat.

Não coloque Access Token no `mcp.json`. A autenticação é OAuth. Não cole `APP_USR-` nem `TEST-` nesta conversa.

Detalhes: [conexão MCP](https://www.mercadopago.com.br/developers/pt/docs/mcp-server/connection) e `docs/mercadopago-mcp.md`.

## Pagamento real (resumo técnico)

O GitHub Pages serve só o site estático. A cobrança fica na API da pasta `server/`.

```bash
cd server
npm install
npm test
```

1. App + **credenciais de produção** (`APP_USR-`) na conta que recebe
2. Publique `server/` com `DEMO_PAYMENTS=false` e `MP_TEST_MODE=false`
3. Coloque a URL da API em `checkout-config.js` (`apiUrl`)

## Dados pessoais (LGPD)

A loja não cria cadastro permanente. O **CPF vai só ao Mercado Pago**. Na CEME ficam nome, WhatsApp, itens e endereço para postar. O CEP pode ir à **ViaCEP**. O número do cartão **nunca** passa pelo site nem pelo servidor da CEME.

Há política em `privacidade.html`, consentimento no checkout e no formulário, CORS fechado em produção se `ALLOWED_ORIGINS` estiver vazio, e o pedido só confirma depois que a API consulta o Mercado Pago.

Isso reduz risco de vazamento e atende transparência e minimização. Não substitui advogado, DPO (se a lei exigir) nem o contrato com o Mercado Pago.

## Publicar (GitHub Pages)

O site estático pode ficar online em:

`https://gabriel7z.github.io/Site/`

**Passos (uma vez):**
1. No GitHub: **Settings → General → Danger Zone** — deixe o repositório **público** (necessário no plano Free).
2. **Settings → Pages → Build and deployment → Source**: escolha **GitHub Actions**.
3. Faça push em `main` (ou rode o workflow **Deploy GitHub Pages** manualmente).
