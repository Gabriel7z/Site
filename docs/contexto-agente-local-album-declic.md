# Contexto para agente local — subir as 8 músicas do álbum Déclic

Use este documento como briefing completo. O agente local tem acesso aos arquivos em `c:\Users\SUPORTE\Downloads\` e deve **subir tudo para o GitHub** no repositório abaixo.

---

## Repositório

- **GitHub:** `https://github.com/Gabriel7z/Site`
- **Branch base:** `main`
- **Site publicado (GitHub Pages):** `https://gabriel7z.github.io/Site/`
- **API/checkout (Render):** pasta `server/` — faixas completas ficam no servidor, não no Pages

---

## Objetivo

Substituir os MP3 de placeholder do álbum **Déclic — Liberte sua Expressão** (produto `musicas-neuroconectivas`, R$ 64) pelas **8 faixas reais** enviadas pelo cliente.

Depois do pagamento aprovado, o cliente baixa um ZIP com as 8 faixas pela API. No site público só tocam **prévias curtas** (~45 s).

---

## Arquivos de origem (PC do cliente)

Pasta: `c:\Users\SUPORTE\Downloads\`

| # | Arquivo original no PC |
|---|------------------------|
| 1 | `Fluxo da Vida Fluir Dentro de mim 2.mp3.mpeg` |
| 2 | `Eu me perdoo.mp3.mpeg` |
| 3 | `Expresse sua arte.mp3.mpeg` |
| 4 | `A alma canta.mp3.mpeg` |
| 5 | `Beleza da Alma Voltou a Cantar 2.mp3.mpeg` |
| 6 | `A música é a Chave.mp3.mpeg` |
| 7 | `É preciso união.mp3.mpeg` |
| 8 | `Déclic.mp3.mpeg` |

A ordem acima é a **ordem oficial do álbum** (faixa 1 → 8), salvo instrução contrária do cliente.

Extensão `.mp3.mpeg` costuma ser MP3 com nome errado — converter para `.mp3` com ffmpeg se necessário.

---

## Onde colocar cada coisa

### Faixas completas (download pós-pagamento)

**Pasta:** `server/private/digital/musicas-neuroconectivas/`

**Nomes finais obrigatórios:**

| # | Nome do arquivo no repositório | Título exibido no site |
|---|--------------------------------|------------------------|
| 1 | `01-fluxo-da-vida-fluir-dentro-de-mim.mp3` | Fluxo da Vida Fluir Dentro de Mim |
| 2 | `02-eu-me-perdoo.mp3` | Eu Me Perdoo |
| 3 | `03-expresse-sua-arte.mp3` | Expresse Sua Arte |
| 4 | `04-a-alma-canta.mp3` | A Alma Canta |
| 5 | `05-beleza-da-alma-voltou-a-cantar.mp3` | Beleza da Alma Voltou a Cantar |
| 6 | `06-a-musica-e-a-chave.mp3` | A Música É a Chave |
| 7 | `07-e-preciso-uniao.mp3` | É Preciso União |
| 8 | `08-declic.mp3` | Déclic |

**Não** colocar as faixas completas em `assets/` (isso iria parar no GitHub Pages público).

### Prévias do site (trechos curtos)

**Pasta:** `assets/audio/album/`

Arquivos: `preview-1.mp3` … `preview-8.mp3` (gerados automaticamente — ver passo 3 abaixo).

---

## Passo a passo para o agente local

### 1. Clonar e criar branch

```bash
git clone https://github.com/Gabriel7z/Site.git
cd Site
git checkout main
git pull origin main
git checkout -b cursor/album-declic-faixas-6a3f
```

### 2. Importar os MP3 do Downloads

**Opção A — script do repositório** (recomendado):

```bash
bash scripts/import-album-tracks.sh "c:/Users/SUPORTE/Downloads"
```

**Opção B — manual:** copiar/renomear cada arquivo para `server/private/digital/musicas-neuroconectivas/` com os nomes da tabela acima. Se não for MP3 válido, converter:

```bash
ffmpeg -y -i "arquivo.mp3.mpeg" -codec:a libmp3lame -b:a 192k "01-fluxo-da-vida-fluir-dentro-de-mim.mp3"
```

### 3. Gerar prévias públicas

Requer **ffmpeg** instalado:

```bash
bash scripts/make-album-previews.sh
```

Isso sobrescreve `assets/audio/album/preview-1.mp3` … `preview-8.mp3`.

### 4. Atualizar nomes das faixas no código

Editar estes arquivos com os **títulos reais** (não deixar "Faixa 1", "Faixa 2"):

#### `server/digital.js`

Atualizar o array `tracks` do produto `musicas-neuroconectivas`:

```js
tracks: [
  { file: "01-fluxo-da-vida-fluir-dentro-de-mim.mp3", title: "Fluxo da Vida Fluir Dentro de Mim" },
  { file: "02-eu-me-perdoo.mp3", title: "Eu Me Perdoo" },
  // ... até 08-declic.mp3
],
```

#### `scripts/make-album-previews.sh`

Atualizar a lista `tracks=(` com os novos nomes de arquivo (mesmos de `server/digital.js`).

#### `index.html` (seção `#album`, lista `#album-tracks`)

Trocar labels como `1. Faixa 1 — prévia` por `1. Fluxo da Vida Fluir Dentro de Mim — prévia` (e assim por diante). Manter `data-audio="assets/audio/album/preview-N.mp3"`.

#### `i18n.js` (opcional mas recomendado)

Adicionar chaves `albumTrack1` … `albumTrack8` em **pt, en, es, de, fr** e usar `data-i18n` nos botões de prévia. Títulos das músicas podem permanecer em português em todos os idiomas.

#### `server/digital.test.js`

Atualizar asserts que procuram `01-faixa-1.mp3` / `08-faixa-8.mp3` para os novos nomes.

### 5. Testar

```bash
cd server
npm install
npm test
```

Todos os testes devem passar.

### 6. Commit e push

```bash
git add server/private/digital/musicas-neuroconectivas/
git add assets/audio/album/
git add server/digital.js server/digital.test.js scripts/make-album-previews.sh scripts/import-album-tracks.sh
git add index.html i18n.js
git commit -m "Adiciona as 8 faixas oficiais do álbum Déclic e atualiza prévias"
git push -u origin cursor/album-declic-faixas-6a3f
```

### 7. Publicar

- Abrir PR para `main` **ou** merge direto em `main` (conforme combinado com o cliente).
- Push em `main` dispara deploy automático do site estático (GitHub Pages).
- **Render:** se o backend já aponta para este repo, um novo deploy no Render pega as faixas completas em `server/private/digital/` — confira no painel Render se o serviço `ceme-checkout` redeployou.

---

## O que NÃO fazer

- Não colocar faixas completas em `assets/audio/album/` (só prévias).
- Não alterar preço do álbum (R$ 64) nem criar planos mensais/trimestrais.
- Não misturar com o produto **Neuro-conexão** (`musica-neuroconexao`, R$ 222, música personalizada).
- Não commitar tokens, senhas ou `DB_URL` de produção.

---

## Verificação final

1. **Site:** `https://gabriel7z.github.io/Site/#album` — 8 botões de prévia com nomes corretos; áudio toca.
2. **Teste de compra (sandbox):** após pagamento aprovado, download do ZIP em `pedidos.html` contém os 8 MP3 com nomes corretos.
3. **Tamanho:** faixas completas só em `server/private/digital/musicas-neuroconectivas/`; prévias menores em `assets/audio/album/`.

---

## Prompt pronto para colar no agente local

```
Leia o arquivo docs/contexto-agente-local-album-declic.md neste repositório.

Tarefa:
1. Pegar os 8 arquivos em c:\Users\SUPORTE\Downloads\ (lista no doc).
2. Importar para server/private/digital/musicas-neuroconectivas/ com os nomes padronizados.
3. Rodar scripts/make-album-previews.sh (instalar ffmpeg se faltar).
4. Atualizar títulos das faixas em server/digital.js, index.html, i18n.js e testes.
5. Rodar npm test em server/.
6. Commit, push na branch cursor/album-declic-faixas-6a3f e merge em main para publicar.

Não coloque as faixas completas em assets/. Não mude preços nem planos.
```

---

## Contato / dúvidas

Se a ordem das faixas estiver errada, o cliente pode confirmar antes do merge. Se algum arquivo tiver nome ligeiramente diferente no Downloads, use correspondência por conteúdo ou peça confirmação.
