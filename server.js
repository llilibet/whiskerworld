require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
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

app.listen(process.env.PORT, () => {
  console.log("=====================================");
  console.log("  Whiskerworld API ativa! 🐾");
  console.log("  Porta:", process.env.PORT);
  console.log(`  URL: http://localhost:${process.env.PORT}`);
  console.log("=====================================");
});

