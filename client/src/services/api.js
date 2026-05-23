// ── Service Layer: base API client ──────────────────────────────────────────
// Centralises all HTTP communication with the backend.

const BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function getUsuarioLogado() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

async function request(path, options = {}, auth = false) {
  const headers = { ...options.headers };

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body ?? null;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    body = JSON.stringify(body);
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE}${path}`, { method: options.method || 'GET', headers, body });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    let json = null;
    try { json = JSON.parse(text); } catch { /* ignore */ }
    throw new Error((json && json.mensagem) || res.statusText || `Erro ${res.status}`);
  }

  const text = await res.text().catch(() => null);
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  getAuth: (path) => request(path, {}, true),
  postAuth: (path, body) => request(path, { method: 'POST', body }, true),
  putAuth: (path, body) => request(path, { method: 'PUT', body }, true),
  deleteAuth: (path) => request(path, { method: 'DELETE' }, true),
  postFormAuth: (path, formData) =>
    request(path, { method: 'POST', body: formData }, true),
  putFormAuth: (path, formData) =>
    request(path, { method: 'PUT', body: formData }, true),
};
