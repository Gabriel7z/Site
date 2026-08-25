# Mercado Pago MCP na loja CEME

Configuração oficial, sem token no arquivo:

```json
{
  "mcpServers": {
    "mercadopago-mcp-server": {
      "url": "https://mcp.mercadopago.com/mcp"
    }
  }
}
```

Está em `.cursor/mcp.json`. Fonte: [conexão MCP](https://www.mercadopago.com.br/developers/pt/docs/mcp-server/connection).

## O que o MCP faz (e o que não faz)

O MCP **não** substitui a API Node (`server/`). A cobrança continua assim:

1. Cliente preenche dados na CEME
2. `POST /api/checkout` cria uma **Preference** (Checkout Pro)
3. Redireciona para `init_point` no Mercado Pago
4. Volta ao site; a API confirma o status

O MCP serve para o **agente no Cursor Desktop**, autenticado na **sua** conta:

- criar aplicativo
- listar credenciais de teste
- configurar webhook
- criar usuários de teste
- consultar documentação (`search-documentation`)
- qualidade da integração

Credenciais de **produção** (`APP_USR-`) o MCP **não** devolve. Elas entram só na hospedagem da API (`MP_ACCESS_TOKEN`), nunca no GitHub e nunca no chat.

## Ligar no Cursor Desktop

1. Abra o repositório no Cursor (app no computador).
2. **Settings → Tools & MCP → Connect** em `mercadopago-mcp-server`.
3. País: **Brasil**. Autorize o Cursor.
4. Peça no chat: criar app Checkout Pro, webhook e usuários de teste.

## Agente na nuvem

O Cloud Agent **não** recebe as ferramentas do MCP até o Connect existir nesse ambiente. Por isso “Bora fazer acontecer” daqui só deixa o `mcp.json` pronto e o checkout no código. A autorização da conta é no seu Cursor.

## Depois do Connect: o que colar no servidor

O Access Token de **teste** (`TEST-`) ou de **produção** (`APP_USR-`) vai em `server/.env` (local) ou nas variáveis da hospedagem:

```
MP_ACCESS_TOKEN=...
DEMO_PAYMENTS=false
MP_TEST_MODE=true
```

Em produção: `MP_TEST_MODE=false` e token `APP_USR-` da conta que recebe o dinheiro.

Nunca commite `.env`. Nunca cole o token no Cursor chat.
