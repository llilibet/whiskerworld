const AppError = require('../errors/AppError');

const opcoesPermitidas = {
  tipoMoradia: ['casa', 'apartamento', 'outro'],
  permiteAnimais: ['sim', 'nao', 'naoSei'],
  espacoAdequado: ['sim', 'adaptar', 'nao'],
  temCriancas: ['sim', 'nao'],
  outrosAnimais: ['sim', 'nao'],
  horasSozinho: ['ate4', 'entre4e8', 'mais8'],
  cuidadosDiarios: ['sim', 'organizar', 'nao'],
  condicoesFinanceiras: ['sim', 'planejar', 'nao'],
  experiencia: ['sim', 'nao'],
  concordancia: ['sim', 'conversar', 'nao'],
};

const pontos = {
  permiteAnimais: { sim: 2, naoSei: 1, nao: 0 },
  espacoAdequado: { sim: 2, adaptar: 1, nao: 0 },
  horasSozinho: { ate4: 2, entre4e8: 1, mais8: 0 },
  cuidadosDiarios: { sim: 2, organizar: 1, nao: 0 },
  condicoesFinanceiras: { sim: 2, planejar: 1, nao: 0 },
  concordancia: { sim: 2, conversar: 1, nao: 0 },
};

const camposEssenciais = [
  'permiteAnimais',
  'espacoAdequado',
  'cuidadosDiarios',
  'condicoesFinanceiras',
  'concordancia',
];

function calcularCompatibilidade(respostas) {
  if (
    !respostas ||
    typeof respostas !== 'object' ||
    Array.isArray(respostas)
  ) {
    throw new AppError('Envie as respostas do questionário.', 400);
  }

  for (const [campo, opcoes] of Object.entries(opcoesPermitidas)) {
    if (!opcoes.includes(respostas[campo])) {
      throw new AppError(
        `Resposta obrigatória ausente ou inválida: ${campo}.`,
        400
      );
    }
  }

  const pontuacao = Object.entries(pontos).reduce(
    (total, [campo, valores]) => total + valores[respostas[campo]],
    0
  );

  const temImpedimento = camposEssenciais.some(
    (campo) => respostas[campo] === 'nao'
  );

  let nivel = 'Baixa';

  if (!temImpedimento) {
    if (pontuacao >= 10) {
      nivel = 'Alta';
    } else if (pontuacao >= 6) {
      nivel = 'Média';
    }
  }

  const mensagens = {
    Alta: 'Suas respostas indicam condições favoráveis para assumir os cuidados de um animal. Converse com os responsáveis sobre as necessidades específicas do pet escolhido.',
    Média: 'Sua rotina apresenta pontos que precisam de planejamento. Revise as condições de moradia, tempo e cuidados antes de avançar.',
    Baixa: 'Suas respostas indicam condições que precisam ser revistas antes da adoção. Converse com os responsáveis para entender os cuidados necessários e as possíveis adaptações.',
  };

  const orientacoes = [];

  if (respostas.permiteAnimais !== 'sim') {
    orientacoes.push('Confirme a autorização para manter animais no imóvel.');
  }

  if (respostas.espacoAdequado !== 'sim') {
    orientacoes.push('Prepare um espaço seguro e adequado para o animal.');
  }

  if (respostas.horasSozinho !== 'ate4') {
    orientacoes.push(
      'Planeje companhia, atividades e apoio durante os períodos em que o animal ficará sozinho. A tolerância varia entre animais.'
    );
  }

  if (respostas.cuidadosDiarios !== 'sim') {
    orientacoes.push('Organize sua rotina para alimentação, higiene, brincadeiras e passeios, quando necessários.');
  }

  if (respostas.condicoesFinanceiras !== 'sim') {
    orientacoes.push('Planeje os gastos com alimentação, cuidados veterinários e emergências.');
  }

  if (respostas.concordancia !== 'sim') {
    orientacoes.push('Converse com todos os moradores antes de assumir a adoção.');
  }

  if (respostas.tipoMoradia === 'apartamento') {
    orientacoes.push('Verifique a segurança de janelas, sacadas e áreas de acesso.');
  }

  if (respostas.temCriancas === 'sim') {
    orientacoes.push('Planeje a adaptação e supervisione as interações entre crianças e o animal.');
  }

  if (respostas.outrosAnimais === 'sim') {
    orientacoes.push('Faça a apresentação aos outros animais de forma gradual e supervisionada.');
  }

  if (respostas.experiencia === 'nao') {
    orientacoes.push('Busque orientação sobre os cuidados e a adaptação do seu primeiro pet.');
  }

  return {
    nivel,
    pontuacao,
    pontuacaoMaxima: 12,
    mensagem: mensagens[nivel],
    orientacoes,
    aviso:
      'Esta avaliação usa regras simplificadas, sem validação científica, e não avalia todas as necessidades individuais do animal. O resultado é apenas orientativo, não impede a manifestação de interesse e não substitui a análise dos responsáveis pela adoção.',
  };
}

module.exports = { calcularCompatibilidade };