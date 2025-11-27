// admin-cadastrar-animal.js
// Depende de: apiRequestAuth, apiRequest, getToken, API_BASE_URL

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-animal");
  const inputFoto = document.getElementById("foto");
  const preview = document.getElementById("preview-foto");
  const btnCancel = document.getElementById("btn-cancel");
  const title = document.getElementById("form-title");
  const btnSubmit = document.getElementById("btn-submit");

  inputFoto.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      preview.src = url;
    } else {
      preview.src = "https://placekitten.com/300/300";
    }
  });

  btnCancel.addEventListener("click", () => {
    window.location.href = "admin-dashboard.html";
  });

  // Se houver ?id=... -> estamos em edição
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    title.textContent = "Editar animal";
    btnSubmit.textContent = "Salvar alterações";
    carregarAnimalParaEdicao(id);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      if (!getToken()) {
        alert("Faça login como administrador antes.");
        return;
      }

      const formData = new FormData(form);
      // Observação: se estiver editando e não trocar a foto, backend mantém foto atual.
      if (id) {
        // PUT expects JSON by your controller; however we support multipart by sending FormData and server handles file via multer.
        // Some backends need PUT with JSON; if your backend expects form-data for edit, use method POST with ?_method=PUT or adjust backend.
        // We'll send PUT with fetch and FormData — Express + multer can handle if route is configured for .put and multer.single()
        const resp = await fetch(API_BASE_URL + `/animais/${id}`, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + getToken()
            // DO NOT set Content-Type for FormData
          },
          body: formData
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(()=>null);
          let json = null;
          try { json = JSON.parse(txt); } catch{}
          throw new Error((json && json.mensagem) || resp.statusText || txt || "Erro ao atualizar");
        }

        alert("Animal atualizado com sucesso.");
        window.location.href = "admin-dashboard.html";
      } else {
        // criação
        const resp = await fetch(API_BASE_URL + `/animais`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + getToken()
            // don't set content-type
          },
          body: formData
        });

        if (!resp.ok) {
          const txt = await resp.text().catch(()=>null);
          let json = null;
          try { json = JSON.parse(txt); } catch{}
          throw new Error((json && json.mensagem) || resp.statusText || txt || "Erro ao cadastrar");
        }

        alert("Animal cadastrado com sucesso.");
        form.reset();
        preview.src = "https://placekitten.com/300/300";
      }
    } catch (err) {
      console.error("Erro no envio do formulário:", err);
      alert("Erro: " + (err.message || err));
    }
  });
});

async function carregarAnimalParaEdicao(id) {
  try {
    const data = await apiRequestAuth(`/animais/${id}`, { method: "GET" }); // precisa rota pública ou auth
    if (!data) {
      alert("Animal não encontrado.");
      return;
    }

    // Preenche campos
    document.getElementById("animal-id").value = data.id;
    document.getElementById("nome").value = data.nome || "";
    document.getElementById("idade").value = data.idade || "";
    document.getElementById("sexo").value = (data.sexo || "").toUpperCase();
    document.getElementById("tipo").value = (data.tipo || "").toUpperCase();
    document.getElementById("vacinado").value = data.vacinado ? "1" : "0";
    document.getElementById("descricao").value = data.descricao || "";
    if (data.foto_url) {
      document.getElementById("preview-foto").src = `${API_BASE_URL}${data.foto_url}`;
    }
  } catch (err) {
    console.error("Erro ao carregar animal:", err);
    alert("Não foi possível carregar os dados do animal: " + (err.message || err));
  }
}
