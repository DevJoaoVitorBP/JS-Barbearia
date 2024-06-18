const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/db');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('../frontend/public')); // Servir arquivos estáticos

// Rotas da API
const agendamentosRoutes = require('./routes/agendamentos');
app.use('/api/agendamentos', agendamentosRoutes);



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});