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

  try {
    const ags = await apiRequestAuth("/agendamentos", { method: "GET" }); // precisa rota admin
    lista.innerHTML = "";

    if (!ags || ags.length === 0) {
      lista.innerHTML = "<div class='small'>Nenhum agendamento.</div>";
      return;
    }

    ags.forEach((a) => {
      const item = document.createElement("div");
      item.className = "agendamento-item";

      const left = document.createElement("div");
      const usuarioNome = a.nome_usuario || a.usuario_nome || a.email_usuario || a.usuario_id || "Usuário";
      left.innerHTML = `<strong>${usuarioNome}</strong><div class="small">${a.data_visita} ${a.hora_visita}</div><div class="small">Animal ID: ${a.animal_id}</div>`;


      const right = document.createElement("div");
      right.className = "right-controls";
      right.innerHTML = `<span class="small">Status: ${a.status}</span>`;

      const btnConfirm = document.createElement("button");
      btnConfirm.className = "btn";
      btnConfirm.textContent = "Confirmar";
      btnConfirm.addEventListener("click", () => atualizarStatusAgendamento(a.id, "CONFIRMADO", item));

      const btnCancel = document.createElement("button");
      btnCancel.className = "btn btn-danger";
      btnCancel.textContent = "Cancelar";
      btnCancel.addEventListener("click", () => atualizarStatusAgendamento(a.id, "CANCELADO", item));

      right.appendChild(btnConfirm);
      right.appendChild(btnCancel);
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

