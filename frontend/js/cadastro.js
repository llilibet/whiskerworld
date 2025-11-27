document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastro-form");
  if (!form) {
    console.error("Form de cadastro não encontrado (id 'cadastro-form').");
    return;
  }
  form.addEventListener("submit", handleCadastro);
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo") || "ADOTANTE";
  const tipoInput = document.getElementById("tipo");
  if (tipoInput) tipoInput.value = tipo;
});

function validaEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleCadastro(e) {
  e.preventDefault();

  const btn = document.querySelector("#cadastro-form button[type='submit']");
  if (btn) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "Processando...";
  }

  try {
    const nome = (document.getElementById("nome")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();
    const senha = (document.getElementById("senha")?.value || "").trim();

    // preferimos pegar tipo do campo oculto (preenchido por URL), se existir
    const tipoEl = document.getElementById("tipo");
    const tipo = (tipoEl && tipoEl.value) ? tipoEl.value : (new URLSearchParams(window.location.search).get("tipo") || "ADOTANTE");

    if (!nome || !email || !senha) {
      throw new Error("Preencha nome, e-mail e senha.");
    }

    if (!validaEmail(email)) {
      throw new Error("Por favor insira um e-mail válido.");
    }

    // registra o usuário
    await apiRequest("/usuarios/registro", {
      method: "POST",
      body: { nome, email, senha, tipo },
    });

    // tenta login automático para melhorar UX
    let loginData = null;
    try {
      loginData = await apiRequest("/usuarios/login", {
        method: "POST",
        body: { email, senha },
      });

      if (loginData && loginData.token) {
        setToken(loginData.token);
      } else {
        console.warn("Login automático: resposta sem token.");
      }
    } catch (loginErr) {
      console.warn("Cadastro OK, login automático falhou:", loginErr);
      alert("Cadastro realizado! Faça login para continuar.");
      window.location.href = `login.html?tipo=${tipo}`;
      return;
    }

    const tipoServidor = loginData?.usuario?.tipo || tipo || "ADOTANTE";

    alert("Cadastro realizado e login efetuado com sucesso!");

    if (tipoServidor === "ADMIN") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "escolha-perfil.html";
    }
  } catch (err) {
    const msg = err?.message || err?.mensagem || String(err);
    alert("Erro ao cadastrar: " + msg);
    console.error("Erro no cadastro:", err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || "Cadastrar";
    }
  }
}
