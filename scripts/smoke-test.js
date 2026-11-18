#!/usr/bin/env node
'use strict';

/*
 * Smoke test do Whiskerworld publicado (etapa 4 do pipeline de CD).
 *
 * Verifica, no sistema já no ar, que:
 *   - a API responde em /api/health;
 *   - cada grupo de rotas chega à API (Express), e não ao frontend;
 *   - o frontend responde, inclusive em rotas do React Router (fallback da SPA).
 *
 * Uso:
 *   node scripts/smoke-test.js https://whiskerworld.vercel.app
 *   SMOKE_URL=http://localhost:3000 npm run smoke
 *
 * Se o deploy tiver Deployment Protection na Vercel, defina
 * VERCEL_AUTOMATION_BYPASS_SECRET para enviar o cabeçalho de bypass.
 */

const baseUrl = (process.argv[2] || process.env.SMOKE_URL || '').replace(/\/+$/, '');
const tentativas = Number(process.env.SMOKE_TENTATIVAS || 5);
const esperaEntreTentativasMs = Number(process.env.SMOKE_ESPERA_MS || 5000);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 15000);

if (!baseUrl) {
  console.error('Informe a URL: node scripts/smoke-test.js <url> (ou SMOKE_URL).');
  process.exit(2);
}

const cabecalhos = {};
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
  cabecalhos['x-vercel-protection-bypass'] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
}

// O index.html do Vite tem <div id="root">. Se uma rota da API devolver isso,
// a requisição caiu no frontend (problema P1 da proposta).
function ehFrontend(corpo) {
  return corpo.includes('<div id="root">');
}

function exigeSessaoAusente(r) {
  if (r.status !== 401) return `esperava 401, recebeu ${r.status}`;
  if (r.json?.codigo !== 'SESSAO_AUSENTE') return 'resposta 401 sem codigo SESSAO_AUSENTE';
  return null;
}

const verificacoes = [
  {
    nome: 'API: /api/health',
    metodo: 'GET',
    caminho: '/api/health',
    validar: (r) => (r.status === 200 && r.json?.status === 'OK' ? null : `status ${r.status}, corpo ${r.corpo.slice(0, 80)}`),
  },
  {
    nome: 'API: /usuarios (rota pública)',
    metodo: 'GET',
    caminho: '/usuarios/teste',
    validar: (r) => (r.status === 200 ? null : `esperava 200, recebeu ${r.status}`),
  },
  {
    nome: 'API: /animais (lê o Firebase)',
    metodo: 'GET',
    caminho: '/animais',
    validar: (r) => (r.status === 200 && r.json !== undefined ? null : `esperava 200 com JSON, recebeu ${r.status}`),
  },
  {
    nome: 'API: /agendamentos (rota pública)',
    metodo: 'GET',
    caminho: '/agendamentos/horarios-ocupados',
    validar: (r) => (r.status < 500 && r.json !== undefined ? null : `esperava resposta JSON < 500, recebeu ${r.status}`),
  },
  { nome: 'API: /favoritos', metodo: 'GET', caminho: '/favoritos', validar: exigeSessaoAusente },
  { nome: 'API: /compatibilidade', metodo: 'POST', caminho: '/compatibilidade/smoke-test', validar: exigeSessaoAusente },
  { nome: 'API: /adocoes', metodo: 'GET', caminho: '/adocoes/me', validar: exigeSessaoAusente },
  { nome: 'API: /acompanhamentos', metodo: 'GET', caminho: '/acompanhamentos/smoke-test', validar: exigeSessaoAusente },
  {
    nome: 'API: /docs (dashboard)',
    metodo: 'GET',
    caminho: '/docs',
    validar: (r) => (r.status === 200 && r.corpo.includes('Whiskerworld API') ? null : `status ${r.status}`),
  },
  {
    nome: 'Frontend: página inicial',
    metodo: 'GET',
    caminho: '/',
    esperaFrontend: true,
    validar: (r) => (r.status === 200 ? null : `esperava 200, recebeu ${r.status}`),
  },
  {
    nome: 'Frontend: rota do React Router (/login)',
    metodo: 'GET',
    caminho: '/login',
    esperaFrontend: true,
    validar: (r) => (r.status === 200 ? null : `esperava 200, recebeu ${r.status}`),
  },
];

async function requisitar({ metodo, caminho }) {
  const resposta = await fetch(baseUrl + caminho, {
    method: metodo,
    headers: { ...cabecalhos, ...(metodo === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
    body: metodo === 'POST' ? '{}' : undefined,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
  });
  const corpo = await resposta.text();
  let json;
  try {
    json = JSON.parse(corpo);
  } catch {
    json = undefined;
  }
  return { status: resposta.status, corpo, json };
}

async function executar(verificacao) {
  const r = await requisitar(verificacao);
  const noFrontend = ehFrontend(r.corpo);

  if (verificacao.esperaFrontend && !noFrontend) return 'não devolveu o index.html do frontend';
  if (!verificacao.esperaFrontend && noFrontend) return 'caiu no frontend em vez da API (falta regra no vercel.json?)';
  return verificacao.validar(r);
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log(`Smoke test em ${baseUrl}\n`);
  let falhas = 0;

  for (const verificacao of verificacoes) {
    let erro;
    for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
      try {
        erro = await executar(verificacao);
      } catch (e) {
        erro = e.message;
      }
      if (!erro || tentativa === tentativas) break;
      await esperar(esperaEntreTentativasMs);
    }

    if (erro) {
      falhas++;
      console.log(`  ✗ ${verificacao.nome}: ${erro}`);
    } else {
      console.log(`  ✓ ${verificacao.nome}`);
    }
  }

  console.log(`\n${verificacoes.length - falhas}/${verificacoes.length} verificações passaram.`);
  process.exit(falhas ? 1 : 0);
}

main();
