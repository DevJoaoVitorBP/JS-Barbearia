// Importamos o módulo sqlite3 e criamos uma instância do banco de dados SQLite.
const sqlite3 = require('sqlite3').verbose();

// Conectamos ao banco de dados SQLite e criamos a tabela agendamentos.
const db = new sqlite3.Database('./database/barbearia.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite!');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia DATE NOT NULL, 
  horario TEXT NOT NULL, -- Mantemos TEXT com validação
  nomeCliente TEXT
  tipoCorte TEXT
)`);


module.exports = db;