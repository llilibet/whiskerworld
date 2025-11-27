// adotante-dashboard.js

// Dependências esperadas: apiRequestAuth(), getToken()
// Este arquivo foi ajustado para só mostrar o botão "Confirmar" quando o usuário for admin
// e para aguardar carregarInfoUsuario() antes de renderizar agendamentos/favoritos.

document.addEventListener("DOMContentLoaded", async () => {
  if (!getToken()) {
    // não está logado — redirecionar ao login
    window.location.href = "login.html?tipo=ADOTANTE";
    return;
  }

  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html?tipo=ADOTANTE";
    });
  }

  // aguarda carregar info do usuário antes de continuar
  await carregarInfoUsuario();

  // agora carregue os dados que dependem do usuário
  carregarFavoritos();
  carregarAgendamentos();

  // modal controls
  const modalCancel = document.getElementById("modal-cancel");
  if (modalCancel) modalCancel.addEventListener("click", fecharModal);

  const formAg = document.getElementById("form-agendamento");
  if (formAg) formAg.addEventListener("submit", enviarAgendamento);
});

let CURRENT_USER = null;

async function carregarInfoUsuario() {
  try {
    // tenta rota /usuarios/me no backend
    try {
      const me = await apiRequestAuth("/usuarios/me");
      CURRENT_USER = me;
    } catch (err) {
      console.warn("/usuarios/me não disponível, tentando decodificar token");
      CURRENT_USER = null;
    }

    const nameEl = document.getElementById("user-name");
    if (nameEl) {
      if (CURRENT_USER && CURRENT_USER.nome) {
        nameEl.textContent = CURRENT_USER.nome;
      } else {
        // decodifica token para pegar nome
        try {
          const token = getToken();
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload && payload.nome) nameEl.textContent = payload.nome;
        } catch (e) {
        }
      }
    }
  } catch (err) {
    console.error("Erro ao carregar usuário:", err);
  }
}

/* --- utilitária: checa se o usuário atual é admin --- */
function isCurrentUserAdmin() {
  // se CURRENT_USER foi carregado, usa suas propriedades
  if (CURRENT_USER) {
    if (CURRENT_USER.role && String(CURRENT_USER.role).toUpperCase() === "ADMIN") return true;
    if (CURRENT_USER.is_admin || CURRENT_USER.admin) return true;
    return false;
  }

  // fallback: tenta decodificar token
  try {
    const token = getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload) return false;
    if (payload.role && String(payload.role).toUpperCase() === "ADMIN") return true;
    if (payload.is_admin || payload.admin) return true;
  } catch (e) {
    // ignore
  }
  return false;
}

/* Monta URL da foto, aceita tanto objeto quanto caminho string */
function buildUrlFoto(animalOrFotoPath) {
  const fotoPath = typeof animalOrFotoPath === "string"
    ? animalOrFotoPath
    : (animalOrFotoPath && (animalOrFotoPath.foto_url || animalOrFotoPath.foto || animalOrFotoPath.animal_foto || animalOrFotoPath.foto_path || animalOrFotoPath.image));

  if (!fotoPath) return "https://placekitten.com/300/300";

  if (/^https?:\/\//i.test(fotoPath)) return fotoPath;

  const base = window.API_BASE_URL || "";
  if (fotoPath.startsWith("/")) return base + fotoPath;
  return base + "/" + fotoPath;
}

// FAVORITOS
async function carregarFavoritos() {
  const el = document.getElementById("favorites");
  if (!el) return;
  el.innerHTML = "Carregando...";

  try {
    const favs = await apiRequestAuth("/favoritos", { method: "GET" });
    console.log("favoritos raw:", favs);

    el.innerHTML = "";
    if (!favs || favs.length === 0) {
      el.innerHTML = "<div class='muted'>Nenhum favorito ainda.</div>";
      return;
    }

    favs.forEach((f) => {
      // backend retorna: f.animal_nome, f.animal_foto, f.animal_id
      const nome = f.animal_nome || (f.animal && (f.animal.nome || f.animal.name)) || ("Animal " + (f.animal_id ?? ""));
      const foto = buildUrlFoto(f.animal_foto || f.animal_foto_url || f.foto_url || (f.animal && (f.animal.foto_url || f.animal.foto)));

      const card = document.createElement("div");
      card.className = "fav-card";
      card.innerHTML = `
        <img src="${foto}" alt="${escapeHtml(nome)}" />
        <div style="font-weight:700;">${escapeHtml(nome)}</div>
        <div class="muted">${escapeHtml(f.idade || f.age || "")} • ${escapeHtml(f.sexo || f.sexo_animal || "")}</div>
        <div class="fav-actions" style="margin-top:8px;">
          <button class="btn-small btn-agendar" data-animal-id="${f.animal_id ?? (f.animal && f.animal.id) ?? ''}">Agendar visita</button>
          <button class="btn-small btn-remover" data-animal-id="${f.animal_id ?? ''}">Remover</button>
        </div>
      `;
      el.appendChild(card);

      const btnAg = card.querySelector(".btn-agendar");
      if (btnAg) btnAg.addEventListener("click", (ev) => {
        const aid = ev.currentTarget.dataset.animalId;
        abrirModalAgendar(aid);
      });

      const btnRem = card.querySelector(".btn-remover");
      if (btnRem) {
        btnRem.addEventListener("click", async (ev) => {
          const animalId = ev.currentTarget.dataset.animalId;
          if (!animalId) return alert("ID do animal não disponível.");
          if (!confirm("Deseja remover esse favorito?")) return;
          try {
            await apiRequestAuth(`/favoritos/${animalId}`, { method: "DELETE" });
            card.remove();
          } catch (err) {
            console.error("Erro remover favorito:", err);
            alert("Erro ao remover favorito: " + (err.message || err));
          }
        });
      }
    });
  } catch (err) {
    console.error("Erro carregar favoritos:", err);
    el.innerHTML = `<div class="muted">Erro ao carregar favoritos: ${escapeHtml(err.message || String(err))}</div>`;
  }
}

async function atualizarStatus(agendamentoId, novoStatus, onSuccess) {
  try {
    await apiRequestAuth(`/agendamentos/${agendamentoId}/status`, {
      method: "PUT",
      body: { status: novoStatus }
    });

    if (typeof onSuccess === "function") onSuccess();
    else carregarAgendamentos();
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    alert("Erro ao atualizar status: " + (err.message || err));
  }
}

async function carregarAgendamentos() {
  const el = document.getElementById("agendamentos");
  if (!el) return;
  el.innerHTML = "Carregando...";

  try {
    // chama endpoint que retorna os agendamentos do usuário
    const ags = await apiRequestAuth("/agendamentos/me");
    el.innerHTML = "";

    if (!ags || ags.length === 0) {
      el.innerHTML = "<div class='muted'>Nenhum agendamento.</div>";
      return;
    }

    ags.forEach((a) => {
      // aceita várias formas de campo do backend
      const nomeAnimal = a.nome_animal || a.animal_nome || (a.animal && (a.animal.nome || a.animal.name)) || ("Animal " + (a.animal_id || ""));
      const dataStr = (() => {
        try {
          return a.data_visita ? new Date(a.data_visita).toLocaleString() : "";
        } catch(e) { return a.data_visita || ""; }
      })();

      const item = document.createElement("div");
      item.className = "agend-item";

      // só mostra o botão Confirmar quando quem está logado for admin
      const showConfirmBtn = isCurrentUserAdmin();

      item.innerHTML = `
        <div>
          <strong>${escapeHtml(a.usuario_nome || a.usuario || a.nome_usuario || "")}</strong>
          <div class="muted">${escapeHtml(nomeAnimal)}</div>
          <div class="muted">${escapeHtml(dataStr)}</div>
        </div>
        <div>
          <div class="muted">Status: <span class="ag-status">${escapeHtml(a.status || "")}</span></div>
          <div style="margin-top:8px;">
            ${ showConfirmBtn ? `<button class="btn-small btn-confirm">Confirmar</button>` : `` }
            <button class="btn-small btn-danger btn-cancel" data-id="${a.id}">Cancelar</button>
          </div>
        </div>
      `;
      el.appendChild(item);

      // Preenche o comportamento dos botões:
      const btnConfirm = item.querySelector(".btn-confirm");
      const btnCancel = item.querySelector(".btn-cancel");

      // Se o status já for CONFIRMADO, desativa botão Confirmar
      if (btnConfirm && (a.status || "").toUpperCase() === "CONFIRMADO") {
        btnConfirm.disabled = true;
        btnConfirm.textContent = "Confirmado";
        btnConfirm.style.opacity = 0.6;
      }

      // Confirmar: chama atualização de status
      if (btnConfirm) {
        btnConfirm.addEventListener("click", async () => {
          // bloqueia clique duplo
          btnConfirm.disabled = true;
          btnConfirm.textContent = "Aguarde...";
          await atualizarStatus(a.id, "CONFIRMADO", () => {
            // atualiza somente o item sem recarregar tudo:
            const statusEl = item.querySelector(".ag-status");
            if (statusEl) statusEl.textContent = "CONFIRMADO";
            btnConfirm.textContent = "Confirmado";
            btnConfirm.disabled = true;
          });
        });
      }

      // Cancelar: chama DELETE e remove item do DOM se ok
      if (btnCancel) {
        btnCancel.addEventListener("click", async (ev) => {
          const id = ev.currentTarget.dataset.id;
          if (!confirm("Deseja cancelar este agendamento?")) return;
          try {
            await apiRequestAuth(`/agendamentos/${id}`, { method: "DELETE" });
            item.remove();
          } catch (err) {
            console.error("Erro ao cancelar:", err);
            alert("Erro ao cancelar: " + (err.message || err));
          }
        });
      }
    });
  } catch (err) {
    console.error("Erro carregar agendamentos:", err);
    el.innerHTML = `<div class="muted">Erro ao carregar agendamentos: ${escapeHtml(err.message || String(err))}</div>`;
  }
}


// MODAL AGENDAR
function abrirModalAgendar(animalId) {
  const input = document.getElementById("ag-animal-id");
  if (input) input.value = animalId;
  const bg = document.getElementById("modal-agendar-bg");
  if (bg) bg.style.display = "flex";
}

function fecharModal() {
  const bg = document.getElementById("modal-agendar-bg");
  if (bg) bg.style.display = "none";
  const form = document.getElementById("form-agendamento");
  if (form) form.reset();
}

// ENVIO AGENDAMENTO
async function enviarAgendamento(ev) {
  ev.preventDefault();
  const animalId = document.getElementById("ag-animal-id").value;
  const data = document.getElementById("data-visita").value;
  const hora = document.getElementById("hora-visita").value;

  if (!data || !hora) {
    alert("Selecione data e hora.");
    return;
  }

  try {
    await apiRequestAuth("/agendamentos", {
      method: "POST",
      body: {
        animal_id: animalId,
        data_visita: data,
        hora_visita: hora
      }
    });

    alert("Agendamento solicitado com sucesso. Aguarde confirmação do abrigo.");
    fecharModal();
    carregarAgendamentos();
  } catch (err) {
    console.error("Erro enviar agendamento:", err);
    alert("Erro ao solicitar agendamento: " + (err.message || err));
  }
}

/* Pequena função para escapar HTML quando mostrar strings do backend */
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
