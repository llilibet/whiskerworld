// const path = require("path");
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");

// const app = express();

// // middlewares
// app.use(cors());
// app.use(express.json());

// // caminhos
// const frontendPath = path.join(__dirname, "..", "frontend");

// // rotas
// const usuariosRoutes = require("../backend/src/routes/usuarios");
// const animaisRoutes = require("../backend/src/routes/animais");
// const agendamentosRoutes = require("../backend/src/routes/agendamentos");
// const favoritosRoutes = require("../backend/src/routes/favoritos");

// app.use("/usuarios", usuariosRoutes);
// app.use("/animais", animaisRoutes);
// app.use("/agendamentos", agendamentosRoutes);
// app.use("/favoritos", favoritosRoutes);

// // arquivos estáticos
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(frontendPath));

// // rota raiz
// app.get("/", (_req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// // iMPORTANTE: só roda localmente
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 3000;

//   app.listen(PORT, () => {
//     console.log("=====================================");
//     console.log("  Whiskerworld API ativa!");
//     console.log("  Porta:", PORT);
//     console.log(`  URL: http://localhost:${PORT}`);
//     console.log("=====================================");
//   });
// }

// //ESSENCIAL PRA VERCEL
// module.exports = app;

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

// rotas - CORREÇÃO AQUI: Adiciona prefixo /api
const usuariosRoutes = require("./src/routes/usuarios");
const animaisRoutes = require("./src/routes/animais");
const agendamentosRoutes = require("./src/routes/agendamentos");
const favoritosRoutes = require("./src/routes/favoritos");

// CORREÇÃO: Adicione o prefixo /api em todas as rotas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/animais", animaisRoutes);
app.use("/api/agendamentos", agendamentosRoutes);
app.use("/api/favoritos", favoritosRoutes);

// arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(frontendPath));

// rota raiz
app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Rota de saúde para verificar se a API está funcionando
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// IMPORTANTE: só roda localmente
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

// ESSENCIAL PRA VERCEL
module.exports = app;