const express = require("express");
const router = express.Router();

/* ─────────────────────────────────────────────
   Metadados da API
───────────────────────────────────────────── */
const API_INFO = {
  title: "Whiskerworld API",
  version: "1.0",
  description: "API de adoção de animais. Gerencie usuários, animais, agendamentos e favoritos.",
};

/* ─────────────────────────────────────────────
   Definição das rotas
───────────────────────────────────────────── */
const ROUTES = [
  {
    group: "saúde",
    desc: "Verificação de status da API",
    endpoints: [
      { method: "GET", path: "/api/health", summary: "Verifica se a API está online", auth: false, params: [], body: null },
    ],
  },
  {
    group: "usuários",
    desc: "Operações de cadastro e autenticação de usuários",
    endpoints: [
      { method: "GET",  path: "/usuarios/teste",        summary: "Rota de teste — confirma que o módulo está ativo",    auth: false, params: [], body: null },
      { method: "POST", path: "/usuarios/registro",     summary: "Registrar novo usuário com e-mail e senha",           auth: false, params: [], body: { nome: "string", email: "string", senha: "string" }, example: { nome: "João Silva", email: "joao@email.com", senha: "senha123" } },
      { method: "POST", path: "/usuarios/google-sync",  summary: "Sincronizar usuário Google no Firestore",             auth: true,  params: [], body: null },
      { method: "GET",  path: "/usuarios/me",           summary: "Retorna dados do usuário autenticado",                auth: true,  params: [], body: null },
    ],
  },
  {
    group: "animais",
    desc: "Listagem, cadastro e gerenciamento de animais disponíveis",
    endpoints: [
      { method: "GET",    path: "/animais",        summary: "Listar animais disponíveis para adoção (público)",  auth: false, params: [{ name: "tipo", in: "query", desc: "Filtrar por tipo: GATO ou CAO" }], body: null },
      { method: "GET",    path: "/animais/:id",    summary: "Obter detalhes de um animal pelo ID",               auth: false, params: [{ name: "id",   in: "path",  desc: "ID numérico do animal" }], body: null },
      { method: "GET",    path: "/animais/admin",  summary: "Listar todos os animais, incluindo indisponíveis",  auth: true,  admin: true, params: [], body: null },
      { method: "POST",   path: "/animais",        summary: "Cadastrar novo animal (multipart/form-data)",       auth: true,  admin: true, multipart: true, params: [], body: { nome: "string (obrig.)", tipo: "GATO | CAO (obrig.)", idade: "number (obrig.)", porte: "PEQUENO | MEDIO | GRANDE (obrig.)", descricao: "string (obrig.)", historico: "string (obrig.)", foto: "file (obrig.)", sexo: "MACHO | FEMEA (opcional)", raca: "string (opcional)", vacinado: "true | false (opcional)" }, example: { nome: "Rex", tipo: "CAO", idade: "3", porte: "MEDIO", descricao: "Cachorro d\u00f3cil e brinca\u0300lhao, \u00f3timo com crian\u00e7as.", historico: "Encontrado abandonado na rua, j\u00e1 castrado e vacinado.", sexo: "MACHO", raca: "Vira-lata", vacinado: "true" } },
      { method: "PUT",    path: "/animais/:id",    summary: "Atualizar dados de um animal (multipart/form-data)",auth: true,  admin: true, multipart: true, params: [{ name: "id", in: "path", desc: "ID do animal" }], body: { nome: "string (obrig.)", tipo: "GATO | CAO (obrig.)", idade: "number (obrig.)", porte: "PEQUENO | MEDIO | GRANDE (obrig.)", descricao: "string (obrig.)", historico: "string (obrig.)", foto: "file (opcional na edi\u00e7\u00e3o)", sexo: "MACHO | FEMEA (opcional)", raca: "string (opcional)", vacinado: "true | false (opcional)" }, example: { nome: "Rex Atualizado", tipo: "CAO", idade: "4", porte: "GRANDE", descricao: "Cachorro d\u00f3cil e bem treinado.", historico: "Resgatado e tratado com sucesso.", sexo: "MACHO", raca: "Labrador", vacinado: "true" } },
      { method: "DELETE", path: "/animais/:id",    summary: "Deletar um animal pelo ID",                         auth: true,  admin: true, params: [{ name: "id", in: "path", desc: "ID numérico do animal" }], body: null },
    ],
  },
  {
    group: "agendamentos",
    desc: "Criação e gerenciamento de visitas para adoção",
    endpoints: [
      { method: "GET",    path: "/agendamentos/horarios-ocupados", summary: "Horários ocupados em uma data (público)",           auth: false, params: [{ name: "data", in: "query", desc: "Data no formato YYYY-MM-DD" }], body: null },
      { method: "POST",   path: "/agendamentos",                   summary: "Criar novo agendamento de visita",                  auth: true,  params: [], body: { animal_id: "number", data: "YYYY-MM-DD", horario: "HH:MM" }, example: { animal_id: 1, data: "2026-06-20", horario: "14:00" } },
      { method: "GET",    path: "/agendamentos/me",                summary: "Listar meus próprios agendamentos",                 auth: true,  params: [], body: null },
      { method: "GET",    path: "/agendamentos",                   summary: "Listar todos os agendamentos (admin)",               auth: true,  admin: true, params: [], body: null },
      { method: "PUT",    path: "/agendamentos/:id/status",        summary: "Atualizar status de um agendamento (admin)",        auth: true,  admin: true, params: [{ name: "id", in: "path", desc: "ID do agendamento" }], body: { status: "pendente | confirmado | cancelado" }, example: { status: "confirmado" } },
      { method: "DELETE", path: "/agendamentos/:id",               summary: "Cancelar ou deletar um agendamento",               auth: true,  params: [{ name: "id", in: "path", desc: "ID do agendamento" }], body: null },
    ],
  },
  {
    group: "favoritos",
    desc: "Gerenciamento dos animais favoritos do usuário",
    endpoints: [
      { method: "GET",    path: "/favoritos",             summary: "Listar animais favoritos do usuário autenticado", auth: true, params: [], body: null },
      { method: "POST",   path: "/favoritos",             summary: "Adicionar um animal aos favoritos",              auth: true, params: [], body: { animal_id: "number" }, example: { animal_id: 1 } },
      { method: "DELETE", path: "/favoritos/:animal_id",  summary: "Remover um animal dos favoritos",               auth: true, params: [{ name: "animal_id", in: "path", desc: "ID do animal" }], body: null },
    ],
  },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const METHOD_STYLE = {
  GET:    { bg: "#ebf3fb", border: "#61affe", badge: "#61affe" },
  POST:   { bg: "#e7f6ec", border: "#49cc90", badge: "#49cc90" },
  PUT:    { bg: "#fef3e2", border: "#fca130", badge: "#fca130" },
  DELETE: { bg: "#fce8e8", border: "#f93e3e", badge: "#f93e3e" },
  PATCH:  { bg: "#e8f6f3", border: "#50e3c2", badge: "#50e3c2" },
};

function schemaRows(body) {
  if (!body) return "";
  return Object.entries(body)
    .map(([k, v]) => `<tr><td class="sf">${k}</td><td class="sv">${v}</td></tr>`)
    .join("");
}

function paramRows(params) {
  if (!params || !params.length) return "";
  return params
    .map(p => `<tr><td class="sf">${p.name}</td><td><span class="pill">${p.in}</span></td><td>${p.desc}</td></tr>`)
    .join("");
}

/* ─────────────────────────────────────────────
   Geração do HTML
───────────────────────────────────────────── */
function buildHTML() {
  let idx = 0;

  const groupsHTML = ROUTES.map(group => {
    const rows = group.endpoints.map(ep => {
      const st  = METHOD_STYLE[ep.method] || METHOD_STYLE.GET;
      const i   = idx++;

      const authTag  = ep.auth  ? `<span class="tag tag-auth">🔐 Requer autenticação</span>` : "";
      const adminTag = ep.admin ? ` <span class="tag tag-admin">👑 Somente Admin</span>` : "";

      const paramsSection = ep.params && ep.params.length
        ? `<p class="slabel">Parâmetros</p>
           <table class="stbl"><thead><tr><th>Nome</th><th>Em</th><th>Descrição</th></tr></thead>
           <tbody>${paramRows(ep.params)}</tbody></table>`
        : "";

      const bodySection = ep.body
        ? `<p class="slabel">Request Body <em>${ep.multipart ? "(multipart/form-data)" : "(application/json)"}</em></p>
           <table class="stbl"><thead><tr><th>Campo</th><th>Tipo</th></tr></thead>
           <tbody>${schemaRows(ep.body)}</tbody></table>`
        : "";

      const showBody = ep.body && !ep.multipart;
      const showMultipart = !!(ep.body && ep.multipart);
      const _ppaths = (ep.path.match(/:[a-zA-Z_]+/g) || []);
      const _ppInputs = _ppaths.map(p => {
        const exVal = ep.paramExamples && ep.paramExamples[p.slice(1)] ? ep.paramExamples[p.slice(1)] : '';
        return '<label>Par\u00e2metro <code>' + p.slice(1) + '</code></label>' +
          '<input class="t-pparam" data-param="' + p + '" type="text" placeholder="Ex: ID do registro" value="' + exVal + '" oninput="updateUrl(' + i + ')" oninput="updateUrl(' + i + ')" />';
      }).join('');
      const _mpInputs = showMultipart
        ? Object.entries(ep.body).map(([f, t]) => {
            const isFile = t === 'file' || t.toLowerCase().includes('file');
            const exVal = ep.example && ep.example[f] ? ep.example[f] : '';
            return '<label>' + f + ' <em style="opacity:.7">' + t + '</em></label>' +
              (isFile
                ? '<input class="t-mp-field" data-field="' + f + '" type="file" style="background:#fff"/>'
                : '<input class="t-mp-field" data-field="' + f + '" type="text" placeholder="' + f + '" value="' + exVal + '"/>');
          }).join('')
        : '';

      return `
        <div class="ep-row" style="background:${st.bg};border-left:5px solid ${st.border}" onclick="toggleEp(${i})">
          <span class="mbadge" style="background:${st.badge}">${ep.method}</span>
          <span class="ep-path">${ep.path}</span>
          <span class="ep-sum">${ep.summary}</span>
          <span class="ep-chev" id="ec${i}">&#8250;</span>
        </div>
        <div class="ep-panel" id="ep${i}">
          <div class="ep-body">
            ${authTag}${adminTag}
            ${paramsSection}
            ${bodySection}
            <div class="try-zone" id="tz${i}" style="display:none">
              <p class="slabel" style="margin-top:14px">Testar</p>
              ${_ppInputs}
              <label>URL <em>(preenchida automaticamente)</em></label>
              <input class="t-url" type="text" value="http://localhost:3000${ep.path}" data-template="http://localhost:3000${ep.path}" readonly style="color:#777;background:#f0f0f0;cursor:default"/>
              <label>Token Bearer <em>(vazio = usa token global)</em></label>
              <input class="t-tok" type="text" placeholder="eyJhbGciO... (ou configure o token global acima)"/>
              ${showBody ? `<label>Body JSON</label><textarea class="t-body">${JSON.stringify(ep.example || ep.body, null, 2)}</textarea>` : ""}
              ${showMultipart ? `<p class="slabel" style="margin-top:8px">Campos (multipart/form-data)</p>${_mpInputs}` : ""}
              <div style="display:flex;gap:8px;margin-top:10px">
                <button class="btn-exec" onclick="doReq(${i},'${ep.method}',${showBody},${showMultipart})">Executar</button>
                <button class="btn-clr"  onclick="clrRes(${i})">Limpar</button>
              </div>
              <div id="rw${i}" style="display:none;margin-top:12px">
                <p class="slabel">Resposta &mdash; <span id="rs${i}"></span></p>
                <pre class="res-pre" id="rb${i}"></pre>
              </div>
            </div>
            <button class="btn-try" onclick="toggleTry(${i})">▶ Try it out</button>
          </div>
        </div>`;
    }).join("");

    return `
      <div class="gblock">
        <div class="gheader" onclick="toggleGroup(this)">
          <div style="display:flex;align-items:baseline;gap:14px">
            <span class="gname">${group.group}</span>
            <span class="gdesc">${group.desc}</span>
          </div>
          <span class="gchev">&#8963;</span>
        </div>
        <div class="gbody">${rows}</div>
      </div>`;
  }).join("");

  const total = ROUTES.reduce((a, g) => a + g.endpoints.length, 0);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${API_INFO.title} – API Docs</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#fafafa;color:#3b4151;font-size:14px}

/* top bar */
.topbar{background:#1b1b1b;padding:9px 0}
.topbar-in{max-width:1060px;margin:0 auto;padding:0 22px;display:flex;align-items:center;gap:10px}
.topbar-logo{font-size:20px}
.topbar-title{color:#fff;font-weight:700;font-size:15px}

/* info */
.info{background:linear-gradient(135deg,#3b4151,#2d3144);color:#fff;padding:26px 22px}
.info-in{max-width:1060px;margin:0 auto}
.ititle{font-size:26px;font-weight:700;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.vbadge{background:#89bf04;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px}
.ilinks{margin-top:6px;display:flex;gap:12px;flex-wrap:wrap}
.ilinks a{color:#a0d3ff;font-size:12px;text-decoration:none}
.ilinks a:hover{text-decoration:underline}
.idesc{margin-top:10px;font-size:13px;opacity:.85}
.hpill{display:inline-flex;align-items:center;gap:6px;margin-top:14px;background:rgba(255,255,255,.1);border-radius:99px;padding:4px 14px;font-size:12px}
#hdot{width:8px;height:8px;border-radius:50%;background:#888;display:inline-block;flex-shrink:0}

/* stats */
.stats{background:#fff;border-bottom:1px solid #ddd;padding:10px 22px;display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:#666}
.stats-in{max-width:1060px;margin:0 auto;display:flex;gap:20px;flex-wrap:wrap}
.stat strong{color:#3b4151}

/* main */
.main{max-width:1060px;margin:22px auto;padding:0 22px 60px}

/* group */
.gblock{border:1px solid #d9d9d9;border-radius:4px;margin-bottom:14px;background:#fff;overflow:hidden}
.gheader{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;cursor:pointer;user-select:none;border-bottom:1px solid #e0e0e0;transition:background .15s}
.gheader:hover{background:#f7f7f7}
.gname{font-size:18px;font-weight:700;color:#3b4151}
.gdesc{font-size:13px;color:#666}
.gchev{font-size:18px;color:#555;transition:transform .2s}
.gbody.collapsed{display:none}

/* endpoint row */
.ep-row{display:flex;align-items:center;gap:10px;padding:8px 12px;border-top:1px solid rgba(0,0,0,.06);cursor:pointer;flex-wrap:wrap;transition:filter .15s}
.ep-row:hover{filter:brightness(.96)}
.mbadge{font-size:11px;font-weight:700;color:#fff;width:66px;text-align:center;padding:4px 0;border-radius:3px;flex-shrink:0;letter-spacing:.5px}
.ep-path{font-size:14px;font-weight:600;min-width:200px;flex-shrink:0}
.ep-sum{font-size:13px;color:#555;flex:1}
.ep-chev{font-size:20px;color:#888;transition:transform .2s;margin-left:auto}

/* panel */
.ep-panel{display:none;border-top:1px solid rgba(0,0,0,.09)}
.ep-panel.open{display:block}
.ep-body{padding:14px 18px;background:#fff}
.slabel{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#3b4151;margin:12px 0 6px}
.tag{display:inline-block;font-size:11px;font-weight:600;padding:3px 9px;border-radius:4px;margin-bottom:8px}
.tag-auth{background:#e6f0fb;color:#0066cc;border:1px solid #b0cff5}
.tag-admin{background:#fef8e7;color:#b45309;border:1px solid #f5d87b}

/* table */
.stbl{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:6px}
.stbl th{background:#f2f2f2;text-align:left;padding:6px 10px;font-size:12px;color:#555;border-bottom:1px solid #ddd}
.stbl td{padding:5px 10px;border-bottom:1px solid #efefef}
.sf{font-family:monospace;font-weight:600}
.sv{font-family:monospace;color:#999}
.pill{background:#e6e6e6;font-size:11px;padding:1px 6px;border-radius:3px;color:#555}

/* try it */
.btn-try{margin-top:10px;background:#fff;border:1px solid #89bf04;color:#89bf04;font-weight:700;font-size:12px;padding:5px 14px;border-radius:4px;cursor:pointer;transition:background .15s,color .15s}
.btn-try:hover{background:#89bf04;color:#fff}
.try-zone label{font-size:12px;color:#555;display:block;margin:8px 0 3px}
.try-zone input,.try-zone textarea{width:100%;border:1px solid #ccc;border-radius:4px;padding:7px 10px;font-size:13px;font-family:monospace;color:#3b4151;background:#fafafa}
.try-zone textarea{min-height:100px;resize:vertical}
.btn-exec{background:#4990e2;color:#fff;border:none;border-radius:4px;padding:7px 18px;font-size:13px;font-weight:700;cursor:pointer}
.btn-exec:hover{background:#357abd}
.btn-clr{background:#fff;border:1px solid #ccc;color:#555;border-radius:4px;padding:7px 14px;font-size:13px;cursor:pointer}
.btn-clr:hover{background:#f0f0f0}
.res-pre{background:#1c1c1c;color:#a8ff78;font-size:12px;padding:12px;border-radius:4px;white-space:pre-wrap;max-height:260px;overflow-y:auto;font-family:'Consolas',monospace}
/* auth bar */
.auth-bar{background:#1e2a3a;padding:10px 22px}
.auth-bar-in{max-width:1060px;margin:0 auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.auth-bar label{color:#a0c8ff;font-size:12px;white-space:nowrap;margin:0}
.auth-bar input{flex:1;min-width:250px;border:1px solid #4a6a8a;background:#0d1a2a;color:#e0e8f0;border-radius:4px;padding:6px 10px;font-size:12px;font-family:monospace}
.auth-bar button{background:#4990e2;color:#fff;border:none;border-radius:4px;padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
.auth-bar button:hover{background:#357abd}
.auth-bar button.aclr{background:#555}
.auth-bar button.aclr:hover{background:#333}
#auth-status{font-size:12px;white-space:nowrap}
</style>
</head>
<body>

<div class="topbar">
  <div class="topbar-in">
    <span class="topbar-logo">🐾</span>
    <span class="topbar-title">Swagger UI — Whiskerworld</span>
  </div>
</div>

<div class="info">
  <div class="info-in">
    <div class="ititle">
      ${API_INFO.title}
      <span class="vbadge">${API_INFO.version}</span>
    </div>
    <div class="ilinks">
      <a href="/api/health" target="_blank">/api/health</a>
      <a href="/docs/swagger.json" target="_blank">/docs/swagger.json</a>
    </div>
    <p class="idesc">${API_INFO.description}</p>
    <div class="hpill"><span id="hdot"></span><span id="htext">Verificando status...</span></div>
  </div>
</div>

<div class="auth-bar">
  <div class="auth-bar-in">
    <label>🔑 Token Global:</label>
    <input id="global-tok" type="text" placeholder="Cole seu Firebase ID Token aqui..."/>
    <button onclick="setGlobalToken()">Autorizar</button>
    <button class="aclr" onclick="clearGlobalToken()">Limpar</button>
    <span id="auth-status"></span>
    <button class="aclr" onclick="toggleLoginForm()" style="margin-left:auto">🔓 Fazer Login</button>
  </div>
  <div id="login-form" style="display:none;max-width:1060px;margin:0 auto;padding:8px 22px 12px;display:none;gap:10px;align-items:flex-end;flex-wrap:wrap">
    <div><label style="color:#a0c8ff;font-size:11px;display:block;margin-bottom:3px">E-mail</label>
    <input id="login-email" type="email" placeholder="joao@email.com" style="min-width:220px;border:1px solid #4a6a8a;background:#0d1a2a;color:#e0e8f0;border-radius:4px;padding:6px 10px;font-size:13px;font-family:monospace"/></div>
    <div><label style="color:#a0c8ff;font-size:11px;display:block;margin-bottom:3px">Senha</label>
    <input id="login-pass" type="password" placeholder="senha123" style="min-width:160px;border:1px solid #4a6a8a;background:#0d1a2a;color:#e0e8f0;border-radius:4px;padding:6px 10px;font-size:13px;font-family:monospace"/></div>
    <button onclick="doLogin()" style="background:#89bf04;color:#fff;border:none;border-radius:4px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer">Entrar e pegar token</button>
    <span id="login-status" style="font-size:12px"></span>
  </div>
</div>

<div class="stats">
  <div class="stats-in">
    <span class="stat">Rotas: <strong>${total}</strong></span>
    <span class="stat">Grupos: <strong>${ROUTES.length}</strong></span>
    <span class="stat">Base URL: <strong>http://localhost:3000</strong></span>
    <span class="stat">Porta: <strong>3000</strong></span>
  </div>
</div>

<div class="main">
  ${groupsHTML}
</div>

<script>
/* health check */
(async()=>{
  try{
    const r=await fetch("/api/health");
    const dot=document.getElementById("hdot");
    const txt=document.getElementById("htext");
    if(r.ok){const d=await r.json();dot.style.background="#89bf04";txt.textContent="Online · "+d.timestamp;}
    else{dot.style.background="#f93e3e";txt.textContent="Offline";}
  }catch{document.getElementById("hdot").style.background="#f93e3e";}
})();

/* toggle group */
function toggleGroup(h){
  const b=h.nextElementSibling;
  const c=h.querySelector(".gchev");
  const open=!b.classList.contains("collapsed");
  b.classList.toggle("collapsed",open);
  c.style.transform=open?"rotate(180deg)":"";
}

/* toggle endpoint panel */
function toggleEp(i){
  const p=document.getElementById("ep"+i);
  const c=document.getElementById("ec"+i);
  const open=p.classList.toggle("open");
  c.style.transform=open?"rotate(90deg)":"";
}

/* toggle try box */
function toggleTry(i){
  const z=document.getElementById("tz"+i);
  z.style.display=z.style.display==="none"?"block":"none";
}

/* execute */
async function doReq(i,method,hasBody,isMultipart){
  const url=document.querySelector("#tz"+i+" .t-url").value.trim();
  const localTok=document.querySelector("#tz"+i+" .t-tok").value.trim();
  const globalTok=((document.getElementById("global-tok")||{}).value||"").trim();
  const tok=localTok||globalTok;
  const bodyEl=document.querySelector("#tz"+i+" .t-body");
  const headers={"Content-Type":"application/json"};
  if(tok)headers["Authorization"]="Bearer "+tok;
  const opts={method,headers};
  if(isMultipart){
    const fd=new FormData();
    document.querySelectorAll("#tz"+i+" .t-mp-field").forEach(inp=>{
      if(inp.type==="file"){if(inp.files&&inp.files[0])fd.append(inp.dataset.field,inp.files[0]);}
      else if(inp.value.trim())fd.append(inp.dataset.field,inp.value.trim());
    });
    opts.body=fd;
    delete opts.headers["Content-Type"];
  } else if(hasBody&&bodyEl){
    try{opts.body=JSON.stringify(JSON.parse(bodyEl.value));}
    catch{alert("Body JSON inválido");return;}
  }
  const rw=document.getElementById("rw"+i);
  const rb=document.getElementById("rb"+i);
  const rs=document.getElementById("rs"+i);
  rs.textContent="Enviando...";rw.style.display="block";rb.textContent="";
  try{
    const res=await fetch(url,opts);
    const text=await res.text();
    let pretty=text;try{pretty=JSON.stringify(JSON.parse(text),null,2);}catch{}
    rs.textContent=res.status+" "+res.statusText;
    rs.style.color=res.ok?"#49cc90":"#f93e3e";
    rb.textContent=pretty;
  }catch(e){
    rs.textContent="Erro de rede";rs.style.color="#f93e3e";rb.textContent=String(e);
  }
}

/* clear */
function clrRes(i){document.getElementById("rw"+i).style.display="none";}

/* update URL from path params */
function updateUrl(i){
  const inp=document.querySelector("#tz"+i+" .t-url");
  let url=inp.dataset.template||inp.value;
  document.querySelectorAll("#tz"+i+" .t-pparam").forEach(p=>{
    if(p.value.trim())url=url.replace(p.dataset.param,encodeURIComponent(p.value.trim()));
  });
  inp.value=url;
}

/* global token */
function setGlobalToken(){
  const v=((document.getElementById("global-tok")||{}).value||"").trim();
  const s=document.getElementById("auth-status");
  if(v){s.textContent="✓ Token definido";s.style.color="#89bf04";}
  else{s.textContent="⚠ Token vazio";s.style.color="#f93e3e";}
}
function clearGlobalToken(){
  const el=document.getElementById("global-tok");
  if(el)el.value="";
  const s=document.getElementById("auth-status");
  if(s)s.textContent="";
}

/* login form toggle */
function toggleLoginForm(){
  const f=document.getElementById("login-form");
  f.style.display=f.style.display==="flex"?"none":"flex";
}

/* login com email/senha via Firebase REST API */
async function doLogin(){
  const email=((document.getElementById("login-email")||{}).value||"").trim();
  const pass=(document.getElementById("login-pass")||{}).value||"";
  const s=document.getElementById("login-status");
  if(!email||!pass){s.textContent="Preencha e-mail e senha.";s.style.color="#f93e3e";return;}
  s.textContent="Autenticando...";s.style.color="#aaa";
  try{
    const r=await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAa-WtoNOa8EMvhDXU6ohNwp-8aNt90Wa0",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password:pass,returnSecureToken:true})
    });
    const d=await r.json();
    if(d.idToken){
      document.getElementById("global-tok").value=d.idToken;
      setGlobalToken();
      s.textContent="✓ Logado como "+d.email;
      s.style.color="#89bf04";
      document.getElementById("login-form").style.display="none";
    } else {
      const msg=(d.error&&d.error.message)||"Credenciais inv\u00e1lidas";
      s.textContent="\u2717 "+msg;
      s.style.color="#f93e3e";
    }
  }catch(e){
    s.textContent="Erro de rede";
    s.style.color="#f93e3e";
  }
}
</script>
</body>
</html>`;
}

/* ─────────────────────────────────────────────
   Rotas Express
───────────────────────────────────────────── */
router.get(["/", ""], (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.send(buildHTML());
});

// Swagger JSON básico (OpenAPI 3.0)
router.get("/swagger.json", (_req, res) => {
  const paths = {};
  ROUTES.forEach(group => {
    group.endpoints.forEach(ep => {
      const swPath = ep.path.replace(/:([a-zA-Z_]+)/g, "{$1}");
      if (!paths[swPath]) paths[swPath] = {};
      paths[swPath][ep.method.toLowerCase()] = {
        tags: [group.group],
        summary: ep.summary,
        security: ep.auth ? [{ bearerAuth: [] }] : [],
      };
    });
  });

  res.json({
    openapi: "3.0.0",
    info: { title: API_INFO.title, version: API_INFO.version, description: API_INFO.description },
    servers: [{ url: "http://localhost:3000" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
    paths,
  });
});

module.exports = router;
