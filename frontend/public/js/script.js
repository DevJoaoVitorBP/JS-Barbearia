const apiUrl = '/api/agendamentos';

// Função para validar o formato do horário (HH:MM)
function validarHorario(horario) {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(horario);
}

// Função para buscar os horários disponíveis 
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

// Função para atualizar o select de horários 
function atualizarSelectHorarios(horarios) {
  const selectHorario = document.getElementById('horario');
  selectHorario.innerHTML = '';

  horarios.forEach(horario => {
    const option = document.createElement('option');
    option.value = horario;
    option.text = horario;
    selectHorario.add(option);
  });
}

// --- Lógica para Edição ---

// Função para carregar os dados do agendamento no formulário (edição)
async function carregarAgendamentoParaEdicao(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const agendamento = await response.json();

    document.getElementById('dia').value = agendamento.dia;
    document.getElementById('horario').value = agendamento.horario;
    document.getElementById('nome').value = agendamento.nomeCliente;

    //  Atualizar dropdown após carregar os dados 
    const horariosDisponiveis = await buscarHorariosDisponiveis(agendamento.dia);
    atualizarSelectHorarios(horariosDisponiveis); 
  } catch (error) {
    console.error('Erro ao carregar agendamento:', error);
    alert('Erro ao carregar agendamento. Por favor, tente novamente.');
  }
}

// Verificar se há um ID de agendamento na URL (modo de edição)
const urlParams = new URLSearchParams(window.location.search);
const agendamentoId = urlParams.get('id');
if (agendamentoId) {
  carregarAgendamentoParaEdicao(agendamentoId);
}

// --- Fim da Lógica para Edição ---

// Adiciona um evento 'change' ao input de data 
const inputData = document.getElementById('dia');
inputData.addEventListener('change', async () => {
  const diaSelecionado = inputData.value;
  const horariosDisponiveis = await buscarHorariosDisponiveis(diaSelecionado);
  atualizarSelectHorarios(horariosDisponiveis);
});

// Função para processar o agendamento 
async function agendar() {

  const data = { dia, horario, nomeCliente: nome };

  try {
    let response;
    if (agendamentoId) {
      // Modo de Edição (PUT)
      response = await fetch(`${apiUrl}/${agendamentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Modo de Criação (POST)
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      // ... (Atualizar lista de horários, exibir mensagem de sucesso e limpar campos - igual ao anterior) 

      // Remover o ID do agendamento da URL após a edição (opcional)
      if (agendamentoId) {
        window.history.replaceState({}, document.title, window.location.pathname); 
      }
    } else {
      alert("Erro ao processar agendamento. Por favor, tente novamente mais tarde.");
    }
  } catch (error) {
    console.error('Erro ao processar agendamento:', error);
    alert("Erro ao processar agendamento. Por favor, tente novamente mais tarde.");
  }
}