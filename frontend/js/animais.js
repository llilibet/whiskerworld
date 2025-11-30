async function carregarAnimais(tipo) {
  const tituloEl = document.querySelector(".animals-page-title");
  const gridEl = document.querySelector(".animals-grid");

  if (!gridEl) return;

  if (tipo === "GATO") {
    tituloEl.textContent = "Gatos";
  } else if (tipo === "CAO") {
    tituloEl.textContent = "Cães";
  }

  gridEl.innerHTML = "<p>Carregando...</p>";

  try {
    const animais = await apiRequest(`/animais?tipo=${tipo}`);

    if (animais.length === 0) {
      gridEl.innerHTML = "<p>Nenhum animal disponível no momento.</p>";
      return;
    }

    gridEl.innerHTML = "";

    animais.forEach((animal) => {
      const card = document.createElement("div");
      card.className = "animal-card";

        const urlFoto = animal.foto_url
    ? `${API_BASE_URL}${animal.foto_url}` 
    : "https://placekitten.com/300/300";

      card.innerHTML = `
        <div class="animal-name">${animal.nome.toLowerCase()}</div>
        <div class="animal-photo-circle">
          <img src="${urlFoto}" alt="${animal.nome}">
        </div>
        <div class="animal-actions">
          <button class="animal-more-btn">mais informações</button>
        </div>
        <div class="animal-fav-icon" title="Favoritar">
          ♡
        </div>
      `;


      const moreBtn = card.querySelector(".animal-more-btn");
      moreBtn.addEventListener("click", () => {
        mostrarDetalhesAnimal(animal);
      });

      const favIcon = card.querySelector(".animal-fav-icon");
      favIcon.addEventListener("click", () => {
        favoritarAnimal(animal.id, favIcon);
      });

      gridEl.appendChild(card);
    });
  } catch (erro) {
    console.error(erro);
    gridEl.innerHTML = `<p>Erro ao carregar animais: ${erro.message}</p>`;
  }
}

function mostrarDetalhesAnimal(animal) {
  const detalheContainerId = "animal-detalhe-container";
  let detalheEl = document.getElementById(detalheContainerId);

  if (!detalheEl) {
    detalheEl = document.createElement("div");
    detalheEl.id = detalheContainerId;
    const gridEl = document.querySelector(".animals-grid");
    gridEl.parentElement.appendChild(detalheEl);
  }

  const urlFoto = animal.foto_url
    ? `${API_BASE_URL}${animal.foto_url}`
    : "https://placekitten.com/300/300";

  detalheEl.innerHTML = `
    <div class="animal-card-detalhe">
      <div class="animal-photo-circle">
        <img src="${urlFoto}" alt="${animal.nome}">
      </div>
      <div class="animal-card-detalhe-info">
        <strong>${animal.nome}</strong><br>
        Idade: ${animal.idade || "não informada"}<br>
        Sexo: ${animal.sexo}<br>
        Vacinado: ${animal.vacinado ? "Sim" : "Não"}<br>
        Status: ${animal.status}<br>
        <br>
        Descrição: ${animal.descricao || "Sem descrição."}
        <div class="animal-card-detalhe-buttons">
          <button class="btn-secondary" onclick="adotarAnimal(${animal.id})">adotar</button>
          <button class="btn-secondary" onclick="fecharDetalhes()">voltar</button>
        </div>
      </div>
    </div>
  `;
}

function fecharDetalhes() {
  const detalheEl = document.getElementById("animal-detalhe-container");
  if (detalheEl) {
    detalheEl.innerHTML = "";
  }
}

// Favoritar (usa /favoritos)
async function favoritarAnimal(animalId, iconEl) {
  const token = getToken();
  if (!token) {
    alert("Você precisa estar logado para favoritar.");
    return;
  }

  try {
    await apiRequestAuth("/favoritos", {
      method: "POST",
      body: JSON.stringify({ animal_id: animalId }),
    });

    iconEl.textContent = "❤";
  } catch (erro) {
    alert("Não foi possível favoritar: " + erro.message);
  }
}

async function adotarAnimal(id) {
  try {
    const token = typeof getToken === "function" ? getToken() : null;
    const url = `${API_BASE_URL}/agendamentos/iniciar/${id}`;
    const headers = { "Accept": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resp = await fetch(url, { method: "GET", headers });

    if (!resp.ok) {
      let body;
      try { body = await resp.json(); } catch(e) { body = null; }
      const msg = body && body.mensagem ? body.mensagem : `Erro: ${resp.status}`;
      alert(msg);
      return;
    }

    const data = await resp.json();

    if (data.disponivel === false) {
      const texto = data.mensagem || "Este animal não está disponível para adoção.";
      alert(texto);
      return;
    }

    if (data.possuiAgendamentoAtivo) {
      alert("Você já possui um agendamento ativo para este animal. Verifique seus agendamentos.");
      return;
    }

    window.location.href = `agendamento.html?id=${id}`;

  } catch (erro) {
    console.error("Erro ao iniciar fluxo de agendamento:", erro);
    alert("Erro ao iniciar agendamento. Tente novamente mais tarde.");
  }
}

