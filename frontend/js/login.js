document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (!form) {
    console.error("Formulário de login não encontrado.");
    return;
  }

  form.addEventListener("submit", fazerLogin);
});

async function fazerLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const dados = await apiRequest("/usuarios/login", {
      method: "POST",
      body: { email, senha }
    });

    if (!dados || !dados.token) {
      alert("Erro: servidor não retornou token.");
      return;
    }

    // 👉 Salvar token
    setToken(dados.token);

    // 👉 Pega o tipo real do usuário retornado pelo backend
    const tipoUsuario = dados.usuario?.tipo || "ADOTANTE";

    alert("Login realizado com sucesso!");

    // 👉 Redireciona baseado no tipo retornado
    if (tipoUsuario === "ADMIN") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "adotante-dashboard.html"; 
    }

  } catch (erro) {
    alert("Falha no login: " + erro.message);
    console.error("Erro no login:", erro);
  }
}
