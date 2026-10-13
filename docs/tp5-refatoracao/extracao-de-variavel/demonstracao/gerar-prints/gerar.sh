#!/usr/bin/env bash
# Executa os comandos reais no Windows PowerShell e transforma a saída em PNG
# com a aparência do Windows Terminal.
# Reaproveita o render.js e o comparar-compatibilidade.js da Extração de Método.
# Uso (Git Bash, na raiz do repositório):
#   bash docs/tp5-refatoracao/extracao-de-variavel/demonstracao/gerar-prints/gerar.sh
# Requer Windows PowerShell e Microsoft Edge (usado em modo headless para a captura).
set -u
AQUI="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$AQUI/../../../../.." && pwd)"
DEST="$REPO/docs/tp5-refatoracao/extracao-de-variavel/evidencias/prints"
RENDER="$REPO/docs/tp5-refatoracao/extracao-de-metodo/demonstracao/gerar-prints/render.js"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
TMP="$(mktemp -d)"
mkdir -p "$DEST"
cd "$REPO"
export FORCE_COLOR=1

PROMPT="PS $(cygpath -w "$REPO")> "
SESSAO=""

# roda: mostra o prompt + comando e o executa de verdade no PowerShell.
# O "-c color.ui=always" só força as cores do git na captura e é omitido na exibição.
roda() {
  SESSAO+="${PROMPT}${1//git -c color.ui=always/git}"$'\n'
  local out
  out="$(powershell.exe -NoProfile -Command "[Console]::OutputEncoding=[Text.Encoding]::UTF8; $1" 2>&1)"
  [ -n "$out" ] && SESSAO+="$out"$'\n'
}
comentario() { SESSAO+="${PROMPT}"$'\e[32m# '"$1"$'\e[0m\n'; }

foto() { # foto <nome>
  printf '%s' "$SESSAO" > "$TMP/$1.ansi"
  read -r W H < <(FORCE_COLOR=0 NO_COLOR=1 node "$RENDER" "$TMP/$1.ansi" "$TMP/$1.html")
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --screenshot="$(cygpath -w "$DEST/$1.png")" --window-size="$W,$H" \
    "file:///$(cygpath -m "$TMP/$1.html")" >/dev/null 2>&1
  echo "gerado: $1.png (${W}x${H})"
  SESSAO=""
}

TESTES='node --test --test-reporter=spec "backend/tests/**/*.test.js"'
HASH='node docs/tp5-refatoracao/extracao-de-metodo/demonstracao/comparar-compatibilidade.js'
GIT='git -c color.ui=always'
SRC='backend/src/services/acompanhamentosService.js backend/src/services/compatibilidadeService.js backend/src/services/fotosAcompanhamentoService.js backend/src/middlewares/uploadFotoAcompanhamento.js'
F=backend/src/services/agendamentosService.js

# 00 - histórico
roda "$GIT log --oneline 80dc0e4..bbcfba0"
foto 00-historico-commits

# 01/03 - versão antiga (código anterior à refatoração, testes novos)
comentario "volta APENAS os arquivos refatorados para a versão anterior à refatoração (os testes continuam os novos)"
roda "git checkout 80dc0e4 -- $SRC"
roda "$TESTES"
foto 01-testes-antes

comentario "versão anterior à refatoração"
roda "$HASH"
foto 03-hash-compatibilidade-antes

# 02/04 - versão refatorada
comentario "restaura os arquivos refatorados"
roda "git checkout HEAD -- $SRC"
roda "$TESTES"
foto 02-testes-depois

comentario "versão refatorada"
roda "$HASH"
foto 04-hash-compatibilidade-depois

# 05 - par neutro
roda "$GIT log --oneline -3 bbcfba0 -- $F"
comentario "hash do conteúdo do arquivo antes de A, depois de A e depois de B"
roda "git rev-parse 5c03706:$F"
roda "git rev-parse 5820eba:$F"
roda "git rev-parse bbcfba0:$F"
comentario "diferença entre o estado antes de A e depois de B (sem saída = arquivos idênticos)"
roda "$GIT diff 5c03706 bbcfba0 -- $F"
roda "(git diff 5c03706 bbcfba0 -- $F | Measure-Object -Line).Lines"
foto 05-par-neutro-prova

# 06-11 - diffs de cada refatoração
roda "$GIT diff 6ba1fb4 532604b -- backend/src/services/acompanhamentosService.js"
foto 06-diff-r1-tem-permissao
roda "$GIT diff 532604b 7015bfc -- backend/src/services/compatibilidadeService.js"
foto 07-diff-r2-pontuacao-compatibilidade
roda "$GIT diff 13d51af a7c9c4f -- backend/src/services/fotosAcompanhamentoService.js"
foto 08-diff-r3-fotos-acompanhamento
roda "$GIT diff 8d748c2 5c03706 -- backend/src/middlewares/uploadFotoAcompanhamento.js"
foto 09-diff-r4-upload-foto
roda "$GIT diff 5c03706 5820eba -- $F"
foto 10-diff-a-extract-variable
roda "$GIT diff 5820eba bbcfba0 -- $F"
foto 11-diff-b-inline-variable

rm -rf "$TMP"
git status --short backend
