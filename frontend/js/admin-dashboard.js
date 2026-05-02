document.addEventListener("DOMContentLoaded", () => {
  if (!window.API_BASE_URL) {
    console.error("API_BASE_URL não encontrado (defina no js/api.js).");
  }
  iniciarDashboard();
  document.getElementById("btn-logout").addEventListener("click", logout);
});

async function iniciarDashboard() {
  try {
    await carregarAnimaisAdmin();
    await carregarAgendamentos();
    await carregarResumo();
  } catch (err) {
    console.error("Erro iniciando dashboard:", err);
    alert("Erro ao carregar dashboard: " + (err.message || err));
  }
}

function urlFotoCompleta(animal) {
  return animal.foto_url ? `${API_BASE_URL}${animal.foto_url}` : "https://placekitten.com/300/300";
}

function formatAgendamentoDateTime(a) {
  const horaSeparada = a.hora_visita || a.hora || a.time || a.horario || a.hour || null;
  const dataSeparada = a.data_visita || a.data || a.date || null;

  // se temos data (possivelmente ISO) e hora separada -> extrai YYYY-MM-DD da data e concatena
  if (dataSeparada && horaSeparada) {
    try {
      const dateOnly = String(dataSeparada).split("T")[0]; // pega apenas YYYY-MM-DD
      let horaNorm = String(horaSeparada).trim();
      if (/^\d{2}:\d{2}$/.test(horaNorm)) horaNorm = horaNorm + ":00"; // "08:30" -> "08:30:00"
      const isoLocal = `${dateOnly}T${horaNorm}`;
      const dt = new Date(isoLocal);
      if (!isNaN(dt)) {
        const date = dt.toLocaleDateString('pt-BR');
        const time = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${date} • ${time}`;
      }
      // fallback textual
      return `${dateOnly} • ${horaSeparada}`;
    } catch (e) {
      // segue para candidatos abaixo
    }
  }

  // tenta campos que já podem ser datetime/ISO
  const datetimeCandidates = [a.data_hora, a.dataHora, a.datetime, a.data_visita, a.created_at, a.timestamp];
  for (const cand of datetimeCandidates) {
    if (!cand) continue;
    try {
      const dt = new Date(cand);
      if (!isNaN(dt)) {
        const date = dt.toLocaleDateString('pt-BR');
        const time = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${date} • ${time}`;
      }
    } catch (e) {}
  }

  // se só existe data sem hora, devolve "dd/mm/yyyy • Horário não informado"
  if (dataSeparada && /^\d{4}-\d{2}-\d{2}$/.test(String(dataSeparada))) {
    const parts = String(dataSeparada).split("-");
    const dd = parts[2], mm = parts[1], yyyy = parts[0];
    return `${dd}/${mm}/${yyyy} • Horário não informado`;
  }

  // se data em outro formato textual (ex: "03/12/2025") só mostra ela
  if (dataSeparada) return String(dataSeparada) + (horaSeparada ? ` • ${horaSeparada}` : " • Horário não informado");

  // nenhum dado de data/hora encontrado
  return "Horário não informado";
}

async function carregarAnimaisAdmin() {
  const listEl = document.getElementById("animals-list");
  listEl.innerHTML = "Carregando...";

  try {
    // listar todos (sem restrição de status)
    const animais = await apiRequestAuth("/animais", { method: "GET" });

    listEl.innerHTML = "";
    if (!animais || animais.length === 0) {
      listEl.innerHTML = "<div class='small'>Nenhum animal cadastrado.</div>";
      return;
    }

    animais.forEach((animal) => {
      const card = document.createElement("div");
      card.className = "animal-admin-card";

      card.innerHTML = `
        <div style="font-weight:600; margin-bottom:6px;">${animal.nome}</div>
        <img src="${urlFotoCompleta(animal)}" alt="${animal.nome}" />
        <div class="small">Tipo: ${animal.tipo}</div>
        <div class="animal-admin-actions">
          <button class="btn btn-edit">Editar</button>
          <button class="btn btn-delete btn-danger">Excluir</button>
        </div>
      `;

      const btnEdit = card.querySelector(".btn-edit");
      btnEdit.addEventListener("click", () => abrirEditarAnimal(animal));

      const btnDel = card.querySelector(".btn-delete");
      btnDel.addEventListener("click", () => excluirAnimalConfirm(animal.id, card));

      listEl.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar animais (admin):", err);
    listEl.innerHTML = `<div class="small">Erro: ${err.message || err}</div>`;
  }
}

function abrirEditarAnimal(animal) {
  // Simples: redireciona para a página de cadastro com query param ?id=...
  // Você pode criar um formulário de edição que leia esse id e faça GET /animais/:id e depois PUT
  window.location.href = `admin-cadastrar-animal.html?id=${animal.id}`;
}

async function excluirAnimalConfirm(id, cardEl) {
  if (!confirm("Confirma exclusão do animal?")) return;
  try {
    await apiRequestAuth(`/animais/${id}`, { method: "DELETE" });
    cardEl.remove();
    await carregarResumo();
    alert("Animal removido.");
  } catch (err) {
    alert("Erro ao remover: " + (err.message || err));
  }
}

// AGENDAMENTOS
async function carregarAgendamentos() {
  const lista = document.getElementById("agendamentos-list");
  lista.innerHTML = "Carregando...";

  // Procura por padrão de hora em qualquer campo do objeto (HH:MM ou HH:MM:SS)
  function extractTimeFromAny(obj) {
    if (!obj || typeof obj !== 'object') return null;
    const timeRegex = /([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?/;
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (!v) continue;
      if (typeof v === 'string') {
        const m = v.match(timeRegex);
        if (m) return m[0];
      }
      // se for nested object, tenta recursivamente
      if (typeof v === 'object') {
        const nested = extractTimeFromAny(v);
        if (nested) return nested;
      }
    }
    return null;
  }

  // Retorna Date ou null (null significa que hora NÃO foi encontrada)
  function buildDateFromParts(dateStr, timeStr) {
    if (!dateStr) return null;

    // se dateStr já contém T (ISO completo) e inclui hora -> parse
    if (dateStr.includes('T')) {
      const d = new Date(dateStr);
      if (!isNaN(d)) return d;
      // se for ISO sem hora falha, continua
    }

    // se temos hora explícita (timeStr)
    if (timeStr) {
      // remover Z/offsets sujos
      const cleanTime = (timeStr + '').split('.')[0].split('Z')[0].split('+')[0];
      const combined = `${dateStr}T${cleanTime}`;
      const d2 = new Date(combined);
      if (!isNaN(d2)) return d2;
    }

    // se não há hora, mas há uma data válida, devolve null para indicar "sem hora"
    const d3 = new Date(dateStr);
    if (!isNaN(d3)) {
      // devolvemos null em vez de Date com 00:00 para tratar horário como "não informado"
      return null;
    }

    return null;
  }

  function formatFriendly(dateObj, dateOnlyStr, timeStr) {
    // dateObj === Date quando temos data+hora; dateOnlyStr quando só temos "YYYY-MM-DD"
    if (dateObj) {
      const date = dateObj.toLocaleDateString('pt-BR');
      const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `${date} • ${time}`;
    }
    if (dateOnlyStr) {
      // tenta transformar YYYY-MM-DD -> dd/mm/yyyy
      const p = dateOnlyStr.split('-');
      if (p.length === 3) {
        const dd = p[2], mm = p[1], yyyy = p[0];
        if (timeStr) {
          // se extraímos timeStr mas não conseguimos combinar para Date, apenas mostre
          return `${dd}/${mm}/${yyyy} • ${timeStr.slice(0,5)}`;
        }
        // sem hora
        return `${dd}/${mm}/${yyyy} • Horário não informado`;
      }
      // fallback genérico
      return dateOnlyStr + (timeStr ? ` • ${timeStr.slice(0,5)}` : ' • Horário não informado');
    }
    return 'Horário não informado';
  }

  try {
    const ags = await apiRequestAuth("/agendamentos", { method: "GET" });
    lista.innerHTML = "";

    if (!ags || ags.length === 0) {
      lista.innerHTML = "<div class='small'>Nenhum agendamento.</div>";
      return;
    }

    ags.forEach((a) => {
      const item = document.createElement("div");
      item.className = "agendamento-item";

      const left = document.createElement("div");
      left.className = "left";

      const usuarioNome = a.nome_usuario || a.usuario_nome || a.email_usuario || a.usuario_id || "Usuário";

      // prioridade: campo explícito de hora -> procura em qualquer campo do objeto -> fallback null
      const dataFormatada = formatAgendamentoDateTime(a);

      left.innerHTML = `<strong>${usuarioNome}</strong>
                        <div class="small agendamento-data">${dataFormatada}</div>
                        <div class="small">Animal ID: ${a.animal_id ?? a.animalId ?? "—"}</div>`;

      const right = document.createElement("div");
      right.className = "right-controls";

      const statusSpan = document.createElement("span");
      statusSpan.className = "small status";
      statusSpan.textContent = `Status: ${a.status ?? "—"}`;

      const btnRow = document.createElement("div");
      btnRow.className = "btn-row";

      const btnConfirm = document.createElement("button");
      btnConfirm.className = "btn btn-confirm";
      btnConfirm.textContent = "Confirmar";
      btnConfirm.addEventListener("click", () => atualizarStatusAgendamento(a.id, "CONFIRMADO", item));

      const btnCancel = document.createElement("button");
      btnCancel.className = "btn btn-cancel";
      btnCancel.textContent = "Cancelar";
      btnCancel.addEventListener("click", () => atualizarStatusAgendamento(a.id, "CANCELADO", item));

      btnRow.appendChild(btnConfirm);
      btnRow.appendChild(btnCancel);

      right.appendChild(statusSpan);
      right.appendChild(btnRow);

      item.appendChild(left);
      item.appendChild(right);
      lista.appendChild(item);
    });

  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
    lista.innerHTML = `<div class="small">Erro: ${err.message || err}</div>`;
  }
}

async function atualizarStatusAgendamento(id, novoStatus, itemEl) {
  try {
    await apiRequestAuth(`/agendamentos/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: novoStatus }),
    });

    const statusSpan = itemEl.querySelector(".right-controls span.small");
    if (statusSpan) statusSpan.textContent = `Status: ${novoStatus}`;

    const btnConfirm = itemEl.querySelector(".right-controls button");
    if (btnConfirm && novoStatus === "CONFIRMADO") {
      btnConfirm.disabled = true;
      btnConfirm.textContent = "Confirmado";
      btnConfirm.style.opacity = "0.6";
    }

    
    await carregarAgendamentos();

    await carregarResumo();
    alert("Status atualizado para " + novoStatus);
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    alert("Erro ao atualizar status: " + (err.message || err));
  }
}

async function carregarResumo() {
  try {
    const animais = await apiRequestAuth("/animais", { method: "GET" });
    const ags = await apiRequestAuth("/agendamentos", { method: "GET" });
    document.getElementById("total-animais").textContent = animais ? animais.length : "—";
    document.getElementById("total-agendamentos").textContent = ags ? ags.length : "—";
  } catch (err) {
    console.warn("Erro ao carregar resumo:", err);
  }
}

function logout() {
  // remove token e redireciona para login
  if (window.localStorage) localStorage.removeItem("token");
  window.location.href = "login.html?tipo=ADMIN";
}

