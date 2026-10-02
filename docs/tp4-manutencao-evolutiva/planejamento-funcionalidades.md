# Planejamento da Manutenção Evolutiva - WhiskerWorld

## 1. Identificação do sistema

O **WhiskerWorld** é um sistema web voltado ao gerenciamento de adoção de animais. A plataforma permite o cadastro e a visualização de animais, autenticação de usuários, manifestação de interesse, agendamento de visitas e gerenciamento administrativo.

## 2. Objetivo

Este documento apresenta o planejamento de duas novas funcionalidades que serão incorporadas ao WhiskerWorld como parte da manutenção evolutiva do sistema:

1. Questionário de compatibilidade para adoção;
2. Acompanhamento pós-adoção.

As funcionalidades propostas ampliam o escopo do produto e melhoram a experiência dos usuários. Elas não têm como objetivo corrigir defeitos existentes.

---

## 3. Funcionalidade 1 - Questionário de compatibilidade para adoção

### 3.1 Descrição

Será desenvolvido um questionário para auxiliar o adotante a avaliar se sua rotina e suas condições são compatíveis com as necessidades do animal escolhido.

O usuário responderá perguntas sobre moradia, disponibilidade de tempo, condições financeiras, presença de crianças ou outros animais e experiência anterior com pets. Ao final, o sistema apresentará um resultado de compatibilidade.

### 3.2 Necessidade identificada

Atualmente, o usuário pode demonstrar interesse em um animal sem realizar uma avaliação inicial sobre sua capacidade de atender às necessidades do pet.

Isso pode gerar solicitações incompatíveis com as necessidades do animal e aumentar o risco de desistência ou devolução.

### 3.3 Justificativa

A funcionalidade contribuirá para uma adoção mais consciente, permitindo que o usuário reflita sobre as responsabilidades envolvidas antes de enviar uma solicitação.

O questionário será apenas orientativo e não substituirá a avaliação realizada pelos responsáveis pela adoção.

### 3.4 Atores envolvidos

- Adotante;
- Administrador.

### 3.5 Fluxo principal

1. O adotante acessa os detalhes de um animal.
2. O sistema apresenta a opção **Verificar compatibilidade**.
3. O adotante inicia o questionário.
4. O sistema apresenta as perguntas.
5. O adotante responde e envia o questionário.
6. O sistema valida as respostas.
7. O sistema calcula e apresenta o resultado de compatibilidade.
8. O adotante pode retornar aos detalhes do animal ou prosseguir para a manifestação de interesse.

### 3.6 Perguntas sugeridas

- Qual é o tipo de residência do adotante?
- O imóvel permite animais?
- Existe espaço adequado para o animal?
- Há crianças na residência?
- Há outros animais na residência?
- Por quantas horas o animal ficará sozinho?
- Existe disponibilidade para passeios e cuidados diários?
- Existe disponibilidade financeira para alimentação e atendimento veterinário?
- O adotante possui experiência anterior com animais?
- Todos os moradores concordam com a adoção?

### 3.7 Regras de negócio

- O questionário deverá estar relacionado ao animal selecionado.
- Todas as perguntas obrigatórias deverão ser respondidas.
- O sistema deverá apresentar o resultado como **Alta**, **Média** ou **Baixa compatibilidade**.
- O resultado deverá apresentar uma breve orientação ao usuário.
- Um resultado baixo não deverá bloquear automaticamente a solicitação de adoção.
- O sistema deverá informar que o resultado é apenas orientativo.
- O questionário não substituirá a análise do administrador.

### 3.8 Critérios de aceitação

- [ ] A opção **Verificar compatibilidade** está disponível na página de detalhes do animal.
- [ ] O sistema apresenta todas as perguntas planejadas.
- [ ] As perguntas obrigatórias são validadas.
- [ ] O resultado é calculado e apresentado após o envio.
- [ ] O resultado informa o nível de compatibilidade.
- [ ] O sistema informa que o resultado é orientativo.
- [ ] O adotante consegue retornar aos detalhes do animal.
- [ ] O adotante consegue prosseguir para a manifestação de interesse.
- [ ] A funcionalidade não interfere no fluxo atual de solicitação de adoção.

### 3.9 Verificação

A funcionalidade será verificada por meio dos seguintes testes:

- preenchimento com respostas de alta compatibilidade;
- preenchimento com respostas de média compatibilidade;
- preenchimento com respostas de baixa compatibilidade;
- tentativa de envio com perguntas obrigatórias vazias;
- verificação da mensagem orientativa;
- verificação da navegação entre o questionário e os detalhes do animal.

---

## 4. Funcionalidade 2 - Acompanhamento pós-adoção

### 4.1 Descrição

Será desenvolvida uma área de acompanhamento pós-adoção, na qual o adotante poderá registrar atualizações sobre a adaptação e o bem-estar do animal adotado.

Cada atualização poderá conter uma descrição, data e fotografia. O administrador poderá visualizar os registros enviados.

### 4.2 Necessidade identificada

Atualmente, o WhiskerWorld acompanha o processo até a aprovação da adoção, mas não disponibiliza um recurso para registrar informações sobre o animal depois que ele é adotado.

### 4.3 Justificativa

O acompanhamento permitirá que a organização responsável verifique como o animal está se adaptando ao novo lar e mantenha contato com o adotante.

A funcionalidade amplia o processo de adoção e contribui para o bem-estar do animal.

### 4.4 Atores envolvidos

- Adotante;
- Administrador.

### 4.5 Fluxo principal

1. O administrador aprova uma solicitação de adoção.
2. A adoção aprovada passa a ser exibida na área do adotante.
3. O adotante seleciona a opção **Registrar acompanhamento**.
4. O sistema apresenta um formulário.
5. O adotante informa a data, escreve a atualização e pode adicionar uma fotografia.
6. O sistema valida e salva os dados.
7. A atualização é exibida no histórico pós-adoção.
8. O administrador pode visualizar o acompanhamento enviado.

### 4.6 Dados do acompanhamento

Cada registro poderá conter:

- identificação da adoção;
- identificação do animal;
- identificação do adotante;
- data do acompanhamento;
- descrição da adaptação do animal;
- fotografia opcional;
- data de criação do registro.

### 4.7 Regras de negócio

- Apenas usuários autenticados poderão acessar a funcionalidade.
- O adotante somente poderá registrar o acompanhamento de um animal cuja adoção tenha sido aprovada para ele.
- A descrição será obrigatória.
- A fotografia será opcional.
- O sistema deverá validar o formato e o tamanho da imagem.
- Os registros deverão ser apresentados em ordem cronológica.
- O adotante somente poderá visualizar os próprios acompanhamentos.
- O administrador poderá visualizar todos os acompanhamentos.
- O registro de uma atualização não deverá modificar o status da adoção.

### 4.8 Critérios de aceitação

- [ ] A funcionalidade está disponível somente para adoções aprovadas.
- [ ] O adotante consegue registrar uma atualização.
- [ ] O sistema exige o preenchimento da descrição.
- [ ] O sistema permite adicionar uma fotografia opcional.
- [ ] Os dados são armazenados corretamente.
- [ ] As atualizações são exibidas em ordem cronológica.
- [ ] O adotante visualiza somente seus próprios registros.
- [ ] O administrador consegue visualizar os acompanhamentos.
- [ ] Usuários não autorizados não conseguem acessar os registros.
- [ ] O registro não modifica o status da adoção.

### 4.9 Verificação

A funcionalidade será verificada por meio dos seguintes testes:

- cadastro de acompanhamento para uma adoção aprovada;
- tentativa de envio sem descrição;
- envio com e sem fotografia;
- tentativa de acesso por usuário não autenticado;
- tentativa de registrar acompanhamento de uma adoção pertencente a outro usuário;
- visualização do histórico pelo adotante;
- visualização dos registros pelo administrador;
- confirmação de que o status da adoção permanece inalterado.

---

## 5. Componentes que poderão ser afetados

A implementação poderá envolver:

- página de detalhes do animal;
- área do perfil do adotante;
- área administrativa;
- componentes de formulário;
- rotas do frontend;
- serviços relacionados aos animais e às adoções;
- banco de dados Firebase;
- regras de autenticação e autorização.

Os nomes exatos dos arquivos deverão ser registrados após a análise da estrutura atual do projeto pela responsável pela implementação.

## 6. Evidências da implementação

Para comprovar a implementação, deverão ser apresentados:

- capturas de tela das novas interfaces;
- vídeo demonstrando os fluxos completos;
- resultados dos testes dos critérios de aceitação;
- commits relacionados a cada funcionalidade;
- comparação entre o sistema antes e depois;
- atualização do `README.md`;
- registro das alterações no `CHANGELOG.md`.

## 7. Resultado esperado

Espera-se que o questionário de compatibilidade auxilie o adotante a tomar uma decisão mais consciente antes de solicitar a adoção.

O acompanhamento pós-adoção deverá permitir o registro da adaptação e do bem-estar do animal depois da aprovação.

As duas funcionalidades caracterizam manutenção evolutiva porque adicionam novas capacidades ao WhiskerWorld e ampliam o escopo original do sistema.