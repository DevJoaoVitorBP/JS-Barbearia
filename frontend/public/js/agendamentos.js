// Estabelendo a URL base da API
const apiUrl = '/api/agendamentos'; 

// Função para obter os agendamentos da API
async function obterAgendamentos() {
  try {
    const response = await fetch(apiUrl);
    const agendamentos = await response.json();
    return agendamentos.map(agendamento => ({
      ...agendamento,
      dia: moment(agendamento.dia).format('DD/MM/YYYY') // Formatar a data
  }));
  } catch (error) {
    console.error('Erro ao obter agendamentos:', error);
    return []; 
  }
}

// Função para excluir um agendamento
async function excluirAgendamento(id) {
  if (confirm("Tem certeza que deseja excluir este agendamento?")) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Agendamento excluído com sucesso!');
        carregarAgendamentosNaTabela(); 
      } else {
        alert('Erro ao excluir agendamento.');
      }
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      alert('Erro ao excluir agendamento.');
    }
  }
}

// Função para carregar os dados do agendamento no modal de edição
async function carregarAgendamentoNoModal(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const agendamento = await response.json();

    document.getElementById('editar-agendamento-id').value = agendamento.id;
    document.getElementById('editar-dia').value = agendamento.dia;
    document.getElementById('editar-nome').value = agendamento.nomeCliente;
    document.getElementById('editar-tipoCorte').value = agendamento.tipoCorte;

    // Carregar horários disponíveis após definir a data
    const horariosDisponiveis = await buscarHorariosDisponiveis(agendamento.dia);
    atualizarSelectHorarios(horariosDisponiveis, 'editar-horario'); 

    // Definir o horário selecionado após carregar as opções
    document.getElementById('editar-horario').value = agendamento.horario;

  } catch (error) {
    console.error('Erro ao carregar agendamento:', error);
    alert('Erro ao carregar agendamento. Por favor, tente novamente.');
  }
}

function editarAgendamento(id) {
  carregarAgendamentoNoModal(id);
  document.getElementById('editarAgendamentoModal').style.display = 'block';
}

// Função para fechar o modal de edição
function fecharModalEdicao() {
  document.getElementById('editarAgendamentoModal').style.display = 'none';
}

// Função para salvar a edição do agendamento
async function salvarEdicaoAgendamento() {
  const id = document.getElementById('editar-agendamento-id').value;
  const dia = document.getElementById('editar-dia').value;
  const horario = document.getElementById('editar-horario').value;
  const nome = document.getElementById('editar-nome').value;
  const tipoCorte = document.getElementById('editar-tipoCorte').value;

  // Validação dos campos do formulário de edição 
  if (!dia || !horario || !nome || !tipoCorte) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Enviar os dados para a API para atualização 
  const data = { dia, horario, nomeCliente: nome, tipoCorte };

  // Enviar os dados para a API para atualização
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Verificar se a atualização foi bem-sucedida
    if (response.ok) {
      alert("Agendamento atualizado com sucesso!");
      fecharModalEdicao();
      carregarAgendamentosNaTabela(); 
    } else {
      alert("Erro ao atualizar agendamento. Por favor, tente novamente mais tarde.");
    }
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    alert("Erro ao atualizar agendamento. Por favor, tente novamente mais tarde.");
  }
}

// Função para carregar os agendamentos na tabela HTML
async function carregarAgendamentosNaTabela() {
  const agendamentos = await obterAgendamentos();
  const tbody = document
    .getElementById('tabela-agendamentos')
    .getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';

  // Adicionar os agendamentos na tabela HTML
  agendamentos.forEach(agendamento => {
    const row = tbody.insertRow();
    row.insertCell().textContent = agendamento.id;
    row.insertCell().textContent = agendamento.dia;
    row.insertCell().textContent = agendamento.horario;
    row.insertCell().textContent = agendamento.nomeCliente;
    row.insertCell().textContent = agendamento.tipoCorte; 

    // Adicionar botões de ação na última coluna da tabela
    const actionsCell = row.insertCell();
    actionsCell.innerHTML = `
      <button onclick="editarAgendamento(${agendamento.id})">Editar</button> 
      <button onclick="excluirAgendamento(${agendamento.id})">Excluir</button>
    `;
  });
}

// Função para buscar os horários disponíveis (reutilizada do script.js)
async function buscarHorariosDisponiveis(dia) {
  try {
    const response = await fetch(`/api/agendamentos/disponibilidade/${dia}`);
    const horarios = await response.json();
    return horarios;
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    return []; 
  }
}

// Função para atualizar o select de horários (modificada para aceitar o ID do select como parâmetro)
function atualizarSelectHorarios(horarios, selectId = 'horario') {
  const selectHorario = document.getElementById(selectId);
  selectHorario.innerHTML = ''; 

  // Adicionar as opções de horários disponíveis
  horarios.forEach(horario => {
    const option = document.createElement('option');
    option.value = horario;
    option.text = horario;
    selectHorario.add(option);
  });
}

// Carregar os agendamentos ao carregar a página
carregarAgendamentosNaTabela();