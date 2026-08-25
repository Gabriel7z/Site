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
3. Preencha os dados (CPF de teste: `529.982.247-25`)
4. Cartão: `4111 1111 1111 1111`, validade futura e CVV `123`
5. Ou gere um Pix e clique em **Já paguei o Pix**

Nenhum valor é cobrado até o Mercado Pago ser conectado.

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
5. No checkout use o cartão Visa `4235 6477 2802 5682`, validade `11/30`, CVV `123`, nome `APRO` e CPF `123.456.789-09`

## Como o dinheiro cai na conta Mercado Pago

O dinheiro **não** cai no GitHub. Ele cai na **conta Mercado Pago em que você estiver logado** ao copiar as chaves de **produção**. Entre com a conta da Família CEME (a que recebe as vendas), não uma conta pessoal de teste.

1. Abra [Suas integrações](https://www.mercadopago.com.br/developers/panel/app) e faça login na conta que deve receber o dinheiro.
2. Crie um aplicativo (se ainda não tiver). Produto: **Checkout Transparente** / pagamentos online.
3. No menu esquerdo, abra **Credenciais de produção** (não as de teste).
4. Ative as credenciais: informe o ramo de atividade e o site (`https://gabriel7z.github.io/Site/` ou o domínio da loja).
5. Copie o par de **produção**:
   - **Access Token** começa com `APP_USR-` (chave secreta da API — nunca cola no GitHub, no `checkout-config.js` nem no chat)
   - **Public Key** também começa com `APP_USR-` (usada no navegador para o cartão)
6. Chave que começa com `TEST-` **não cobra** e o dinheiro **não cai**. Isso é só laboratório.
7. A API precisa estar **online** (Render, Railway ou similar). O GitHub Pages só serve o HTML e não consegue cobrar.
8. Na hospedagem da API, coloque as variáveis (nunca no repositório):

```
MP_ACCESS_TOKEN=APP_USR-...
MP_PUBLIC_KEY=APP_USR-...
DEMO_PAYMENTS=false
MP_TEST_MODE=false
ALLOWED_ORIGINS=https://gabriel7z.github.io
```

9. No site, em `checkout-config.js`, cole a URL pública da API em `apiUrl` (exemplo: `https://sua-api.onrender.com`).
10. Depois da venda aprovada, o valor aparece no [Mercado Pago](https://www.mercadopago.com.br) daquela conta. De lá vocês transferem para o banco.

A conta Mercado Pago precisa estar verificada (documento e, para sacar, dados bancários). Taxas do MP saem de cada venda aprovada (Pix, cartão etc.).

**Não envie o Access Token** para ninguém. Se vazar, renove as credenciais no painel.

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

A loja não cria cadastro permanente. CPF, e-mail, telefone e endereço vão ao **Mercado Pago** para cobrar e entregar. O CEP pode ir à **ViaCEP**. O número do cartão **não** é enviado ao servidor da CEME.

Há política em `privacidade.html`, consentimento no checkout e no formulário, CORS fechado em produção se `ALLOWED_ORIGINS` estiver vazio, e o Pix só confirma pedido depois que o Mercado Pago marca como aprovado.

Isso reduz risco de vazamento e atende transparência e minimização. Não substitui advogado, DPO (se a lei exigir) nem o contrato com o Mercado Pago.

## Publicar (GitHub Pages)

## Publicar (GitHub Pages)

O site estático pode ficar online em:

`https://gabriel7z.github.io/Site/`

**Passos (uma vez):**
1. No GitHub: **Settings → General → Danger Zone** — deixe o repositório **público** (necessário no plano Free).
2. **Settings → Pages → Build and deployment → Source**: escolha **GitHub Actions**.
3. Faça push em `main` (ou rode o workflow **Deploy GitHub Pages** manualmente).
