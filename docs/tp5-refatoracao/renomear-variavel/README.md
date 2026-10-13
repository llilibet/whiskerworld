# Refatoração: Renomear Variável (Rename Variable)

Parte do **TP5 – Refatoração** do Whiskerworld. Este diretório reúne tudo o que foi feito com a técnica **Renomear Variável**, do catálogo de Martin Fowler, tomando como referência o capítulo 9 de Engenharia de Software Moderna.

## 1. Resumo das Refatorações
Aplica a refatoração Renomear Variável no backend. A documentação completa com as justificativas profundas está dividida em:
* `01-code-smells.md`: Identificação dos problemas de nomenclatura.
* `02-refatoracoes-planejadas.md`: Justificativa das escolhas.
* `03-refatoracao-oportunista.md`: Limpezas locais realizadas durante o processo.
* `04-par-neutro-extract-inline.md`: Referência ao par neutro realizado pela equipe.

| R | Refatoração | Tipo | Arquivo |
| :--- | :--- | :--- | :--- |
| R1 | `count` renomeado para `quantidadeRemovida` | Planejada | `favoritosService.js` |
| R2 | `body` renomeado para `dadosNovoAnimal` / `dadosAtualizacao` | Planejada | `animaisService.js` |
| R3 | `err` renomeado para `erro` | Planejada | `usuariosController.js` |

## 2. Evidências de "Antes e Depois" no Código

### R1 - `favoritosService.js` (Code Smell: Nomes Misteriosos)
**Antes:**
```javascript
const count = await favoritosRepository.remove(usuarioId, animalId);
if (!count) {
  throw new AppError('Favorito não encontrado.', 404);
}
