const agendamentosController = require('../src/controllers/agendamentosController');
const animaisRepository = require('../src/repositories/animaisRepository');
const agendamentosRepository = require('../src/repositories/agendamentosRepository');

async function main() {
  animaisRepository.findById = async () => ({
    id: 1,
    nome: 'Luna',
    tipo: 'Cachorro',
  });

  agendamentosRepository.findActiveByUsuarioAndAnimal = async () => [];
  agendamentosRepository.findOcupadosByData = async () => [];
  agendamentosRepository.create = async (payload) => payload;

  const req = {
    usuario: {
      id: 7,
      nome: 'João da Silva',
      email: 'joao@email.com',
    },
    body: {
      animal_id: 1,
      data_visita: '2026-08-30',
      hora_visita: '14:00',
      observacoes: 'Teste via terminal',
    },
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      console.log('--- RESPOSTA DO CONTROLLER ---');
      console.log('STATUS:', this.statusCode);
      console.log(JSON.stringify(payload, null, 2));
      return payload;
    },
  };

  console.log('--- CHAMANDO CONTROLLER ---');
  await agendamentosController.criarAgendamento(req, res);
}

main().catch((err) => {
  console.error('Erro ao executar o script:', err);
  process.exit(1);
});
