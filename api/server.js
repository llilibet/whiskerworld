const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");

const app = express();
const frontendPath = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());

// rotas
const usuariosRoutes = require("./src/routes/usuarios");
const animaisRoutes = require("./src/routes/animais");
const agendamentosRoutes = require("./src/routes/agendamentos");
const favoritosRoutes = require("./src/routes/favoritos");

app.use("/usuarios", usuariosRoutes);
app.use("/animais", animaisRoutes);
app.use("/agendamentos", agendamentosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(frontendPath));

app.get("/", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(process.env.PORT, () => {
  console.log("=====================================");
  console.log("  Whiskerworld API ativa! 🐾");
  console.log("  Porta:", process.env.PORT);
  console.log(`  URL: http://localhost:${process.env.PORT}`);
  console.log("=====================================");
});
