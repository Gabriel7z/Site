#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-3001}"

echo
echo "Loja CEME"
echo "Abra no navegador (a porta é obrigatória):"
echo "  http://127.0.0.1:${PORT}"
echo "  http://localhost:${PORT}"
echo
echo "http://localhost  sem a porta NÃO abre a loja."
echo "Deixe esta janela aberta. Para parar: Ctrl+C"
echo

if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  echo "Já está rodando em http://127.0.0.1:${PORT}"
  exit 0
fi

if [[ ! -d server/node_modules ]]; then
  echo "Instalando a API (só na primeira vez)..."
  (cd server && npm install)
fi

cd server
exec npm start
