# Evidência 1 — Atualização da dependência Vite

## Descrição

Esta evidência apresenta a execução da estratégia de manutenção adaptativa aplicada ao sistema Whiskerworld.

A adaptação consistiu na atualização da dependência Vite, que estava utilizando uma versão desatualizada no frontend do sistema.

## Situação antes da adaptação

Antes da manutenção, o comando `npm outdated` indicava que a versão instalada do Vite estava desatualizada.

### Evidência em vídeo

[Assistir ao vídeo antes da atualização](./evidencias/vite-antes.mp4)

### Evidência em imagem

![Vite antes da atualização](./evidencias/vite-antes.png)

## Alteração realizada

A dependência Vite foi atualizada no frontend do sistema. Como consequência, os arquivos `package.json` e `package-lock.json` foram modificados para registrar a nova versão.

## Situação depois da adaptação

Após a atualização, foram executados comandos para verificar a versão instalada e confirmar que o sistema continuava funcionando corretamente.

### Evidência em vídeo

[Assistir ao vídeo depois da atualização](./evidencias/vite-depois.mp4)

### Evidência em imagem

![Vite depois da atualização](./evidencias/vite-depois.png)

## Resultado

A dependência Vite foi atualizada com sucesso. O sistema continuou executando normalmente após a mudança, demonstrando sua adaptação à nova versão da dependência.