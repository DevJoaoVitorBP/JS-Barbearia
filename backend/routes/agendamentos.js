const express = require('express');
const router = express.Router();
const agendamentosController = require('../controllers/agendamentoController');

// Rota para obter todos os agendamentos (com filtro opcional por dia)
router.get('/', agendamentosController.obterAgendamentos);

// Rota para verificar a disponibilidade de horários em um dia
router.get('/disponibilidade/:dia', agendamentosController.verificarDisponibilidade);

// Rota para criar um novo agendamento
router.post('/', agendamentosController.criarAgendamento);

// Rota para atualizar um agendamento existente
router.put('/:id', agendamentosController.atualizarAgendamento);

// Rota para excluir um agendamento
router.delete('/:id', agendamentosController.excluirAgendamento);

// Rota para obter um agendamento por ID
router.get('/:id', agendamentosController.obterAgendamentoPorId);

module.exports = router;