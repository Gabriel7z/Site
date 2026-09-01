# Acessos da loja CEME e teste com cartão

Este arquivo é para o dono da loja passar para quem for testar. **Não tem usuário de login na CEME.** Não cole Access Token do Mercado Pago aqui.

Loja: https://gabriel7z.github.io/Site/

---

## 1. Acompanhar pedido (cliente)

**Não tem senha.**

- Página: https://gabriel7z.github.io/Site/pedidos.html
- O cliente cola o número que começa com `CEME-` (sai no checkout e no cupom PDF).

---

## 2. Área da loja / lista para postar (quem envia)

Aqui sim tem senha. **Não é usuário + senha:** só um campo.

| Campo | Valor |
| --- | --- |
| Página | https://gabriel7z.github.io/Site/envios.html |
| Usuário | *não existe* |
| Senha da loja (`ADMIN_KEY`) | `ceme-local` |

Se alguém trocou `ADMIN_KEY` no Render, vale a senha nova — esta é a padrão.

---

## 3. O que **não** existe neste site

- Cadastro de membro
- Login com e-mail
- Usuário para o cliente
- Senha para a página de rastreio

---

## 4. Testar pagamento com **cartão de teste**

A API no Render ainda está em **sandbox** (não cobra de verdade). Use janela anônima.

### Na loja CEME (antes de ir ao Mercado Pago)

Use um CPF válido no checkout da CEME, por exemplo:

- Nome: `Maria Silva`
- E-mail: o seu (confirme igual)
- Celular: `(61) 99999-1111` (confirme igual)
- CPF: `529.982.247-25`

### No Checkout Pro (tela do Mercado Pago)

1. Entre com a **conta de teste comprador** do app (Suas integrações → Contas de teste → Comprador). Usuário e senha dessa conta **só aparecem no painel do Mercado Pago** — a CEME não guarda isso.
2. Pague com cartão de **crédito de teste**:

| Bandeira | Número | Validade | CVV |
| --- | --- | --- | --- |
| Visa | `4235 6477 2802 5682` | `11/30` | `123` |
| Mastercard | `5480 8328 0103 3311` | `11/30` | `123` |
| American Express | `3753 651535 56885` | `11/30` | `1234` |

| Resultado | Nome no cartão | Documento |
| --- | --- | --- |
| **Aprovado** (use este para testar) | `APRO` | CPF `12345678909` |
| Recusado | `OTHE` | CPF `12345678909` |

Fonte: [cartões de teste do Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/test-cards).

Pix de teste também aparece nessa tela. Cartão de crédito de verdade só depois da chave `APP_USR-` no Render.

---

## 5. Depois que o pagamento aprovar

- Cliente: `pedidos.html` + número `CEME-…`
- Loja: `envios.html` + senha `ceme-local`
