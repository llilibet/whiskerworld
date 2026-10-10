#!/usr/bin/env bash
# Executa os comandos reais no Windows PowerShell e transforma a saída em PNG
# com a aparência do Windows Terminal.
# Uso (Git Bash, na raiz do repositório):
#   bash docs/tp5-refatoracao/extracao-de-metodo/demonstracao/gerar-prints/gerar.sh
# Requer Windows PowerShell e Microsoft Edge (usado em modo headless para a captura).
set -u
AQUI="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$AQUI/../../../../.." && pwd)"
DEST="$REPO/docs/tp5-refatoracao/extracao-de-metodo/evidencias/prints"
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
  read -r W H < <(FORCE_COLOR=0 NO_COLOR=1 node "$AQUI/render.js" "$TMP/$1.ansi" "$TMP/$1.html")
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --screenshot="$(cygpath -w "$DEST/$1.png")" --window-size="$W,$H" \
    "file:///$(cygpath -m "$TMP/$1.html")" >/dev/null 2>&1
  echo "gerado: $1.png (${W}x${H})"
  SESSAO=""
}

TESTES='node --test --test-reporter=spec "backend/tests/**/*.test.js"'
HASH='node docs/tp5-refatoracao/extracao-de-metodo/demonstracao/comparar-compatibilidade.js'
GIT='git -c color.ui=always'
F=backend/src/services/acompanhamentosService.js

# 00 - histórico
roda "$GIT log --oneline 654a967~1..0a6dd16"
foto 00-historico-commits

# 01/03 - versão antiga (serviços do commit anterior à refatoração)
comentario "volta APENAS os serviços para a versão anterior à refatoração (os testes continuam os novos)"
roda "git checkout 654a967 -- backend/src/services"
roda "$TESTES"
foto 01-testes-antes

comentario "versão anterior à refatoração"
roda "$HASH"
foto 03-hash-compatibilidade-antes

# 02/04 - versão refatorada
comentario "restaura os serviços refatorados"
roda "git checkout HEAD -- backend/src/services"
roda "$TESTES"
foto 02-testes-depois

comentario "versão refatorada"
roda "$HASH"
foto 04-hash-compatibilidade-depois

# 05 - par neutro
roda "$GIT log --oneline -3 f3b8a2a -- $F"
comentario "hash do conteúdo do arquivo antes de A, depois de A e depois de B"
roda "git rev-parse c3a7cd2:$F"
roda "git rev-parse 0a61813:$F"
roda "git rev-parse f3b8a2a:$F"
comentario "diferença entre o estado antes de A e depois de B (sem saída = arquivos idênticos)"
roda "$GIT diff c3a7cd2 f3b8a2a -- $F"
roda "(git diff c3a7cd2 f3b8a2a -- $F | Measure-Object -Line).Lines"
foto 05-par-neutro-prova

# 06-10 - diffs de cada refatoração
roda "$GIT diff 654a967 466e742 -- backend/src/services/compatibilidadeService.js"
foto 06-diff-r1-compatibilidade
roda "$GIT diff 466e742 f6b0fc2 -- backend/src/services/usuariosService.js"
foto 07-diff-r2-registrar-usuario
roda "$GIT diff f6b0fc2 c3a7cd2 -- backend/src/services/usuariosService.js"
foto 08-diff-r3-normalizar-tipo-usuario
roda "$GIT diff c3a7cd2 0a61813 -- $F"
foto 09-diff-a-extract-method
roda "$GIT diff 0a61813 f3b8a2a -- $F"
foto 10-diff-b-inline-method

rm -rf "$TMP"
git status --short backend
