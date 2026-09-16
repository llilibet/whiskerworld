# Etapa 2 – Simulação de Mudança de Dependência

## 1. Identificação

| Informação | Detalhes |
| --- | --- |
| Sistema | Whiskerworld |
| Tipo de manutenção | Manutenção adaptativa |
| Estratégia | Simulação de mudança de dependência |
| Componente afetado | Frontend |
| Branch | `etapa-2-mudanca-dependencia` |
| Sistema operacional | Windows |
| Node.js | `24.20.0` |
| npm | `11.9.0` |

## 2. Objetivo

Esta etapa teve como objetivo aplicar o conceito de manutenção adaptativa
no Whiskerworld por meio da atualização de uma dependência utilizada
pelo frontend.

A dependência escolhida foi o Vite, ferramenta utilizada para executar
o ambiente de desenvolvimento e gerar a versão de produção da aplicação
React.

Após a atualização, foi identificada uma incompatibilidade com o plugin
do React. O projeto precisou ser adaptado para restabelecer a
compatibilidade entre as dependências.

## 3. Dependências envolvidas

| Dependência | Versão anterior instalada | Nova versão |
| --- | ---: | ---: |
| `vite` | `5.4.21` | `8.3.0` |
| `@vitejs/plugin-react` | `4.7.0` | `6.1.1` |

No `package.json`, as versões anteriores estavam declaradas como
`^5.4.2` para o Vite e `^4.3.1` para o plugin. O `package-lock.json`
registrava as versões efetivamente instaladas.

## 4. Situação antes da mudança

Antes da atualização, o frontend utilizava o Vite `5.4.21` e o
`@vitejs/plugin-react` `4.7.0`.

A versão foi confirmada com o comando:

```bash
npx vite --version
```

Em seguida, o Whiskerworld foi executado e suas telas foram acessadas
normalmente, comprovando o funcionamento do sistema antes da mudança.

### Evidência

- Vídeo: `01-funcionamento-antes-atualizacao.mp4`

## 5. Mudança de dependência

O Vite foi atualizado para a versão `8.3.0` com o comando:

```bash
npm install vite@8.3.0 --save-dev
```

A atualização modificou os seguintes arquivos:

```text
client/package.json
client/package-lock.json
```

## 6. Problema adaptativo enfrentado

Durante a atualização, o npm informou que o
`@vitejs/plugin-react@4.7.0` aceitava somente as seguintes versões do
Vite:

```text
^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0
```

Como o Vite foi atualizado para a versão `8.3.0`, a versão instalada do
plugin não declarava compatibilidade com a nova versão.

A incompatibilidade foi confirmada com:

```bash
npm ls vite @vitejs/plugin-react
```

O comando apresentou:

```text
vite@8.3.0 invalid
npm error code ELSPROBLEMS
```

Portanto, mesmo com a instalação do Vite concluída, a árvore de
dependências do frontend ficou inconsistente.

### Evidências

- Vídeo: `02-incompatibilidade-apos-atualizacao-vite.mp4`
- Imagem: `02-erro-compatibilidade-vite-plugin-react.png`

## 7. Adaptação implementada

Para resolver a incompatibilidade, o plugin do React foi atualizado da
versão `4.7.0` para a versão `6.1.1`.

O comando utilizado foi:

```bash
npm install @vitejs/plugin-react@6.1.1 --save-dev
```

Após a adaptação, as dependências passaram a utilizar as seguintes
versões:

```text
@vitejs/plugin-react@6.1.1
vite@8.3.0
```

A atualização do plugin foi necessária para que o frontend utilizasse
uma versão compatível com o Vite 8.

## 8. Validação da compatibilidade

A árvore de dependências foi verificada novamente:

```bash
npm ls vite @vitejs/plugin-react
```

Após a adaptação, o comando não apresentou mais as mensagens `invalid`
ou `ELSPROBLEMS`.

Resultado obtido:

```text
@vitejs/plugin-react@6.1.1
└── vite@8.3.0 deduped
vite@8.3.0
```

### Evidência

- Imagem: `03-compatibilidade-restabelecida.png`

## 9. Teste de compilação

A compilação do frontend foi realizada com:

```bash
npm run build
```

O processo foi concluído corretamente:

```text
vite v8.3.0 building client environment for production
50 modules transformed
built in 1.11s
```

Esse resultado confirmou que o código do frontend podia ser compilado
com as novas versões.

## 10. Teste de funcionamento

Após a adaptação, o sistema completo foi iniciado pela raiz do projeto:

```bash
npm run dev
```

O backend e o frontend foram executados, e as páginas do Whiskerworld
foram acessadas normalmente.

### Evidências

- Vídeo: `03-adaptacao-plugin-react.mp4`
- Vídeo: `04-funcionamento-depois-adaptacao.mp4`

## 11. Arquivos modificados

A adaptação alterou os seguintes arquivos:

```text
client/package.json
client/package-lock.json
```

As alterações atualizaram o Vite e o plugin do React, além de ajustar a
árvore de dependências registrada pelo npm.

## 12. Resultado final

A manutenção adaptativa foi concluída com sucesso.

O Vite foi atualizado da versão `5.4.21` para `8.3.0`. A incompatibilidade
com o `@vitejs/plugin-react@4.7.0` foi identificada e comprovada pelo
erro `ELSPROBLEMS`.

Para adaptar o Whiskerworld ao novo ambiente, o plugin foi atualizado
para `6.1.1`. Depois da correção, a árvore de dependências ficou válida,
a compilação foi concluída e o sistema voltou a funcionar normalmente
com as versões atualizadas.