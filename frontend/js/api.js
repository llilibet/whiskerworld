const API_BASE_URL = window.location.origin;
window.API_BASE_URL = API_BASE_URL; 

function setToken(token) {
  if (window.localStorage) {
    localStorage.setItem("token", token);
  }
}

function getToken() {
  if (window.localStorage) {
    return localStorage.getItem("token");
  }
  return null;
}

function clearToken() {
  if (window.localStorage) {
    localStorage.removeItem("token");
  }
}

async function apiRequest(path, opts = {}) {
  const url = API_BASE_URL + path;
  const method = opts.method || "GET";
  const headers = opts.headers ? { ...opts.headers } : {};

  // se body é objeto e não FormData, converte para JSON
  let body = opts.body ?? null;
  if (body && !(body instanceof FormData) && typeof body === "object") {
    body = JSON.stringify(body);
    if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  }

  const resp = await fetch(url, { method, headers, body });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => null);
    let json = null;
    try { json = JSON.parse(txt); } catch(e) {}
    const msg = (json && json.mensagem) || resp.statusText || txt || `Erro ${resp.status}`;
    throw new Error(msg);
  }

  // tenta parsear JSON, ou retorna null se não houver
  const text = await resp.text().catch(() => null);
  if (!text) return null;
  try { return JSON.parse(text); } catch (e) { return text; }
}

async function apiRequestAuth(path, opts = {}) {
  const token = getToken();
  if (!token) throw new Error("Token não encontrado. Faça login.");

  // prepara headers e body (não sobrescrever Content-Type para FormData)
  const headers = opts.headers ? { ...opts.headers } : {};
  if (!(opts.body instanceof FormData)) {
    // conteúdo JSON por padrão (a menos que já tenha Content-Type)
    if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  }
  headers["Authorization"] = "Bearer " + token;

  // prepara body
  let body = opts.body ?? null;
  if (body && !(body instanceof FormData) && typeof body === "object") {
    body = JSON.stringify(body);
  }

  const url = API_BASE_URL + path;
  const resp = await fetch(url, {
    method: opts.method || "GET",
    headers,
    body,
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => null);
    let json = null;
    try { json = JSON.parse(txt); } catch(e) {}
    const msg = (json && json.mensagem) || resp.statusText || txt || `Erro ${resp.status}`;
    // Se for 401/403, opcionalmente limpar token e forçar logout
    if (resp.status === 401 || resp.status === 403) {
      // clearToken(); // opcional: limpar token automaticamente
    }
    throw new Error(msg);
  }

  // retorna JSON ou texto
  const text = await resp.text().catch(() => null);
  if (!text) return null;
  try { return JSON.parse(text); } catch (e) { return text; }
}

/* ---------- Exporta/utiliza globalmente para os outros scripts do front ---------- */
window.apiRequest = apiRequest;
window.apiRequestAuth = apiRequestAuth;
window.getToken = getToken;
window.setToken = setToken;
window.clearToken = clearToken;
