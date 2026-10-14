#!/usr/bin/env bash
# Gera as evidências em texto da refatoração Renomear Variável (TP5).
#
# Uso (Git Bash / Linux / macOS), na RAIZ do repositório, com as dependências instaladas (npm install):
#   bash docs/tp5-refatoracao/renomear-variavel/demonstracao/gerar-evidencias.sh
#
# O que o script faz (nada é escrito à mão: tudo vem da saída real dos comandos):
#   1. gera os diffs de cada refatoração a partir dos commits;
#   2. gera a prova do par neutro (hash do arquivo antes de A e depois de B);
#   3. roda `npm test` no código ANTES das renomeações e no código DEPOIS, e salva as saídas.
#
# No final, o script devolve os arquivos do backend ao estado em que estavam (HEAD).
# Para pular os testes e gerar só diffs e prova do par neutro:  SEM_TESTES=1 bash ...
set -u

REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"
DEST="$REPO/docs/tp5-refatoracao/renomear-variavel/evidencias/texto"
cd "$REPO"
mkdir -p "$DEST"

# ---- commits usados (ver README.md) ----
BASE_FAV=93bbe26^      # favoritosService.js antes de R1
BASE_ANI=b888838^      # animaisService.js e usuariosController.js antes de R2-R5
R1=93bbe26
R2_R5=b888838
TESTES=a5f2b96         # testes de caracterização
OPORT=488d276          # refatoração oportunista (O1 e O2)
PAR_A=11c6d59          # par neutro A
PAR_B=f2c0e9f          # par neutro B

FAV=backend/src/services/favoritosService.js
ANI=backend/src/services/animaisService.js
USR=backend/src/controllers/usuariosController.js

if [ -n "$(git status --porcelain backend)" ]; then
  echo "Há alterações não commitadas em backend/. Faça commit ou stash antes de rodar." >&2
  exit 1
fi

# ---- 1. diffs ----
git diff "$BASE_FAV" "$R1"     -- "$FAV"                > "$DEST/diff-01-r1-favoritos.diff"
git diff "$BASE_ANI" "$R2_R5"  -- "$ANI" "$USR"         > "$DEST/diff-02-r2-r5-animais-usuarios.diff"
git diff "$TESTES"   "$OPORT"  -- backend/src           > "$DEST/diff-03-oportunista.diff"
git diff "$OPORT"    "$PAR_A"  -- "$FAV"                > "$DEST/diff-04-par-neutro-A.diff"
git diff "$PAR_A"    "$PAR_B"  -- "$FAV"                > "$DEST/diff-05-par-neutro-B.diff"
echo "diffs gerados em $DEST"

# ---- 2. prova do par neutro ----
{
  echo "# Prova do par neutro (Rename Variable A + Rename Variable B)"
  echo "# Arquivo: $FAV"
  echo
  echo "\$ git log --oneline $OPORT..$PAR_B -- $FAV"
  git log --oneline "$OPORT..$PAR_B" -- "$FAV"
  echo
  echo "# hash (blob) do conteúdo do arquivo: antes de A, depois de A e depois de B"
  echo "\$ git rev-parse $OPORT:$FAV"
  git rev-parse "$OPORT:$FAV"
  echo "\$ git rev-parse $PAR_A:$FAV"
  git rev-parse "$PAR_A:$FAV"
  echo "\$ git rev-parse $PAR_B:$FAV"
  git rev-parse "$PAR_B:$FAV"
  echo
  echo "# diferença entre o estado antes de A e depois de B (sem saída = arquivos idênticos)"
  echo "\$ git diff $OPORT $PAR_B -- $FAV"
  git diff "$OPORT" "$PAR_B" -- "$FAV"
  echo "\$ git diff $OPORT $PAR_B -- $FAV | wc -l"
  git diff "$OPORT" "$PAR_B" -- "$FAV" | wc -l
} > "$DEST/prova-par-neutro.txt" 2>&1
echo "prova do par neutro gerada"

[ "${SEM_TESTES:-0}" = "1" ] && exit 0

# ---- 3. testes antes / depois ----
restaurar() { git checkout -q HEAD -- backend/src; }
trap restaurar EXIT

echo "Rodando testes DEPOIS (código atual)..."
{ echo "\$ npm test   # código refatorado (HEAD: $(git rev-parse --short HEAD))"; npm test 2>&1; } > "$DEST/testes-depois.txt"

echo "Rodando testes ANTES (código anterior às renomeações; testes novos mantidos)..."
git checkout -q "$BASE_FAV" -- "$FAV"
git checkout -q "$BASE_ANI" -- "$ANI" "$USR"
{ echo "\$ npm test   # código ANTES das renomeações (favoritos: $BASE_FAV, animais/usuários: $BASE_ANI)"; npm test 2>&1; } > "$DEST/testes-antes.txt"
restaurar
trap - EXIT

echo
echo "== Resumo (cole no README, seção 'Como garantimos que o comportamento não mudou') =="
for f in antes depois; do
  printf '%-7s ' "$f:"; grep -E '^(# |ℹ )(tests|pass|fail)' "$DEST/testes-$f.txt" | tr '\n' ' '; echo
done
git status --short backend
