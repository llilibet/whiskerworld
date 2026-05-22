const agendamentosService = require('../services/agendamentosService');
const animaisRepository = require('../repositories/animaisRepository');

function handleError(res, err) {
  console.error(err);
  return res.status(err.status || 500).json({ mensagem: err.message || 'Erro interno.' });
}

async function criarAgendamento(req, res) {
  try {
    const ag = await agendamentosService.criarAgendamento({ usuarioId: req.usuario?.id, ...req.body });
    return res.status(201).json({ mensagem: 'Agendamento criado com sucesso.', agendamento: ag });
  } catch (err) { return handleError(res, err); }
}

async function listarMeusAgendamentos(req, res) {
  try {
    const list = await agendamentosService.listarMeusAgendamentos(req.usuario?.id);
    return res.json(list);
  } catch (err) { return handleError(res, err); }
}

async function listarTodosAgendamentos(req, res) {
  try {
    const list = await agendamentosService.listarTodosAgendamentos();
    return res.json(list);
  } catch (err) { return handleError(res, err); }
}

async function atualizarStatusAgendamento(req, res) {
  try {
    await agendamentosService.atualizarStatus(req.params.id, req.body.status);
    return res.json({ mensagem: 'Status atualizado com sucesso.' });
  } catch (err) { return handleError(res, err); }
}

async function deletarAgendamento(req, res) {
  try {
    await agendamentosService.deletarAgendamento(req.params.id);
    return res.json({ mensagem: 'Agendamento removido com sucesso.' });
  } catch (err) { return handleError(res, err); }
}

async function iniciarFluxoAgendamento(req, res) {
  try {
    const animal = await animaisRepository.findById(req.params.animalId);
    if (!animal) return res.status(404).json({ mensagem: 'Animal nÃ£o encontrado.' });
    const disponivel = (animal.status || '').toUpperCase() === 'DISPONIVEL';
    let possuiAgendamentoAtivo = false;
    if (req.usuario?.id) {
      const rows = await require('../repositories/agendamentosRepository')
        .findActiveByUsuarioAndAnimal(req.usuario.id, req.params.animalId);
      possuiAgendamentoAtivo = rows.length > 0;
    }
    return res.json({ animal, disponivel, possuiAgendamentoAtivo });
  } catch (err) { return handleError(res, err); }
}

module.exports = {
  criarAgendamento,
  listarMeusAgendamentos,
  listarTodosAgendamentos,
  atualizarStatusAgendamento,
  deletarAgendamento,
  iniciarFluxoAgendamento,
};
