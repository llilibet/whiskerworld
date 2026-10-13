// Usado por gerar.sh. Uso: node render.js <entrada.ansi> <saida.html>
// Converte texto com códigos ANSI em uma página HTML com aparência do
// Windows Terminal (PowerShell, tema Campbell) e imprime "largura altura"
// (px CSS) para o screenshot.
const fs = require('fs');
const [, , entrada, saida] = process.argv;

const texto = fs.readFileSync(entrada, 'utf8').replace(/\r/g, '').replace(/\n+$/, '');

// Paleta "Campbell", padrão do Windows Terminal
const cores = {
  30: '#0C0C0C', 31: '#C50F1F', 32: '#13A10E', 33: '#C19C00', 34: '#0037DA', 35: '#881798', 36: '#3A96DD', 37: '#CCCCCC',
  90: '#767676', 91: '#E74856', 92: '#16C60C', 93: '#F9F1A5', 94: '#3B78FF', 95: '#B4009E', 96: '#61D6D6', 97: '#F2F2F2',
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let fg = null, bold = false, dim = false;
const linhas = texto.split('\n');
let maxLen = 0, totalLinhas = 0;
const COLS = 130;
const html = linhas.map((linha) => {
  let out = '', visivel = 0;
  const partes = linha.split(/\x1b\[([\d;]*)m/);
  partes.forEach((p, i) => {
    if (i % 2 === 1) {
      for (const c of (p || '0').split(';').map(Number)) {
        if (c === 0) { fg = null; bold = false; dim = false; }
        else if (c === 1) bold = true;
        else if (c === 2) dim = true;
        else if (c === 22) { bold = false; dim = false; }
        else if (c === 39) fg = null;
        else if (cores[c]) fg = cores[c];
      }
    } else if (p) {
      visivel += [...p].length;
      const st = [fg && `color:${fg}`, bold && 'font-weight:700', dim && 'opacity:.6'].filter(Boolean).join(';');
      out += st ? `<span style="${st}">${esc(p)}</span>` : esc(p);
    }
  });
  maxLen = Math.max(maxLen, visivel);
  totalLinhas += Math.max(1, Math.ceil(visivel / COLS));
  return out || ' ';
}).join('\n');

const LINHA = 20, cols = Math.max(84, Math.min(maxLen, COLS));
const largura = Math.ceil(cols * 8.6) + 100;
const altura = totalLinhas * LINHA + 40 + 32 + 44;

const iconePs = `<svg width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#2671be"/><path d="M4 4.5l4 3.5-4 3.5" stroke="#fff" stroke-width="1.6" fill="none"/><path d="M8.5 11.5h3.5" stroke="#fff" stroke-width="1.6"/></svg>`;

fs.writeFileSync(saida, `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;background:#dfe3e8;}
.win{margin:20px;border-radius:8px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.30);background:#0C0C0C;display:inline-block;border:1px solid #3a3a3a}
.bar{height:40px;background:#202020;display:flex;align-items:flex-end;font:12px "Segoe UI",sans-serif;color:#fff}
.tab{height:32px;margin-left:8px;padding:0 12px;background:#0C0C0C;border-radius:6px 6px 0 0;display:flex;align-items:center;gap:8px;min-width:200px}
.tab .x{margin-left:auto;color:#aaa;font-size:11px}
.mais{height:32px;display:flex;align-items:center;padding:0 12px;color:#ccc;font-size:16px;gap:16px}
.ctl{margin-left:auto;align-self:stretch;display:flex}
.ctl span{width:46px;display:flex;align-items:center;justify-content:center;color:#fff;font:14px "Segoe UI Symbol","Segoe UI",sans-serif}
pre{margin:0;padding:12px 16px 20px;font:14px/20px "Cascadia Mono",Consolas,monospace;color:#CCCCCC;white-space:pre-wrap;word-break:break-all;width:${cols}ch}
</style></head><body><div class="win"><div class="bar"><div class="tab">${iconePs}<span>Windows PowerShell</span><span class="x">✕</span></div><div class="mais"><span>+</span><span style="font-size:11px">⌄</span></div><div class="ctl"><span>&#x2014;</span><span>&#x2610;</span><span>&#x2715;</span></div></div><pre>${html}</pre></div></body></html>`);
console.log(largura, altura);
