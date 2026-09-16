# Evidência 1 — Atualização da dependência Vite

## Descrição

Esta evidência apresenta a execução da estratégia de manutenção adaptativa aplicada ao sistema Whiskerworld.

A adaptação consistiu na atualização da dependência Vite, que estava utilizando uma versão desatualizada no frontend do sistema.

## Situação antes da adaptação

Antes da manutenção, o comando `npm outdated` indicava que a versão instalada do Vite estava desatualizada.

### Evidência em vídeo

[Assistir ao vídeo antes da atualização](./01-antes-atualizacao-vite.mp4)

### Evidência em vídeo

[Assistir ao vídeo de incompatibilidade após a atualização](./02-incompatibilidade-apos-atualizacao-vite.mp4)

### Evidência em vídeo

[Assistir ao vídeo de adaptação de puglin](./03-adaptacao-plugin-react.mp4)

A dependência Vite foi atualizada no frontend do sistema. Como consequência, os arquivos `package.json` e `package-lock.json` foram modificados para registrar a nova versão.

## Situação depois da adaptação

Após a atualização, foram executados comandos para verificar a versão instalada e confirmar que o sistema continuava funcionando corretamente.

### Evidência em vídeo

[Assistir ao vídeo depois da atualização](./04-funcionamento-depois-adaptacao.mp4)

## Resultado

A dependência Vite foi atualizada com sucesso. O sistema continuou executando normalmente após a mudança, demonstrando sua adaptação à nova versão da dependência.