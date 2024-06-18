const db = require('../database/db');

// Função para validar o formato do horário (HH:MM)
function validarHorario(horario) {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(horario);
}

// Função para obter todos os agendamentos
exports.obterAgendamentos = (req, res) => {
  const dia = req.query.dia; // Parâmetro de consulta para filtrar por dia

  let sql = 'SELECT * FROM agendamentos';
  let params = [];

  if (dia) {
    sql += ' WHERE dia = ?';
    params.push(dia);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Função para criar um novo agendamento
exports.criarAgendamento = (req, res) => {
  const { dia, horario, nomeCliente, tipoCorte } = req.body;

  // Validação do horário
  if (!validarHorario(horario)) {
    return res.status(400).json({ error: "Horário inválido!" });
  }

  // Validação do tipo de corte
  if (!tipoCorte) { 
       return res.status(400).json({ error: "Selecione um tipo de corte!" });
   }

  db.run(
    'INSERT INTO agendamentos (dia, horario, nomeCliente, tipoCorte) VALUES (?, ?, ?, ?)',
    [dia, horario, nomeCliente, tipoCorte],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Agendamento criado com sucesso!', id: this.lastID });
    }
  );
};

// Função para atualizar um agendamento existente
exports.atualizarAgendamento = (req, res) => {
  const { dia, horario, nomeCliente, tipoCorte } = req.body;
  const id = req.params.id;

  // Validação do horário (se aplicável)
  if (horario && !validarHorario(horario)) {
    return res.status(400).json({ error: "Horário inválido!" });
  }

  db.run(
    'UPDATE agendamentos SET dia = ?, horario = ?, nomeCliente = ?, tipoCorte = ? WHERE id = ?',
    [dia, horario, nomeCliente, tipoCorte, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Agendamento atualizado com sucesso!' });
    }
  );
};

// Função para excluir um agendamento
exports.excluirAgendamento = (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM agendamentos WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Agendamento excluído com sucesso!' });
  });
};

exports.verificarDisponibilidade = (req, res) => {
  const dia = req.params.dia;
  const horariosDisponiveis = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"
  ]; 

  db.all('SELECT horario FROM agendamentos WHERE dia = ?', [dia], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const horariosAgendados = rows.map(row => row.horario);
    const horariosRealmenteDisponiveis = horariosDisponiveis.filter(
      horario => !horariosAgendados.includes(horario)
    );

    res.json(horariosRealmenteDisponiveis);
  });
};

// Função para obter um agendamento pelo ID (se necessário para outras funcionalidades)
exports.obterAgendamentoPorId = (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM agendamentos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Agendamento não encontrado!' });
    }
    res.json(row);
  });
};