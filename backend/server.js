const path = require("path");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// caminhos
const frontendPath = path.join(__dirname, "..", "frontend");

// rotas
const usuariosRoutes = require("./src/routes/usuarios");
const animaisRoutes = require("./src/routes/animais");
const agendamentosRoutes = require("./src/routes/agendamentos");
const favoritosRoutes = require("./src/routes/favoritos");

app.use("/usuarios", usuariosRoutes);
app.use("/animais", animaisRoutes);
app.use("/agendamentos", agendamentosRoutes);
app.use("/favoritos", favoritosRoutes);

// arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(frontendPath));

// rota raiz
app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

//IMPORTANTE: só roda localmente
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log("=====================================");
    console.log("  Whiskerworld API ativa!");
    console.log("  Porta:", PORT);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log("=====================================");
  });
}

module.exports = app;