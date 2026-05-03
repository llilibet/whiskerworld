// Descobre tipo de usuário pelo parâmetro da URL (ADMIN ou ADOTANTE)
function getTipoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo");
  if (tipo === "ADMIN" || tipo === "ADOTANTE") {
    return tipo;
  }
  // padrão: ADOTANTE
  return "ADOTANTE";
}

// Salva dados no localStorage
function salvarSessao(token, usuario) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// Decide pra onde mandar depois do login
function redirecionarPosLogin(usuario) {
  if (usuario.tipo === "ADMIN") {
    window.location.href = "admin-dashboard.html"; 
  } else {
    window.location.href = "escolha-perfil.html"; // gatos / cães 
  }
}

// ----- Cadastro -----
const cadastroForm = document.querySelector("#cadastro-form");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value.trim();

    const tipo = getTipoFromUrl(); // se veio de ?tipo=ADMIN, cadastra admin

    try {
      const data = await apiRequest("/usuarios/registro", {
        method: "POST",
        body: JSON.stringify({ nome, email, senha, tipo }),
      });

      alert("Cadastro realizado com sucesso! Agora faça login.");
      // volta pro login mantendo o tipo de usuário
      window.location.href = `login.html?tipo=${tipo}`;
      console.log("Cadastro:", data);
    } catch (erro) {
      alert("Erro ao cadastrar: " + erro.message);
    }
  });
}

// ----- Login -----
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  // Ajusta o link de cadastro para manter o tipo
  const tipo = getTipoFromUrl();
  const linkCadastro = document.querySelector("#link-cadastro");
  if (linkCadastro) {
    linkCadastro.href = `cadastro.html?tipo=${tipo}`;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value.trim();

    try {
      const data = await apiRequest("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      });

      salvarSessao(data.token, data.usuario);
      redirecionarPosLogin(data.usuario);
    } catch (erro) {
      alert("Erro ao fazer login: " + erro.message);
    }
  });
}
