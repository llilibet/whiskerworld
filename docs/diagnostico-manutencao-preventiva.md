# Diagnóstico de Manutenção Preventiva — Whiskerworld

## 1. Identificação e Localização do Problema

### Módulo/Componente

O problema de manutenibilidade foi identificado na camada de serviços do backend, especificamente nos seguintes arquivos:

* `backend/src/services/animaisService.js`;
* `backend/src/services/agendamentosService.js`;
* `backend/src/services/usuariosService.js`;
* `backend/src/services/favoritosService.js`.

Esses componentes são responsáveis por regras de negócio relacionadas ao gerenciamento de animais, agendamentos, usuários e favoritos.

### Problema Identificado

O sistema Whiskerworld realiza a criação e configuração de erros manualmente em diferentes serviços da aplicação.

Foram identificados diversos pontos nos quais a classe nativa `Error` é utilizada, seguida da atribuição manual da propriedade responsável pelo status HTTP.

Exemplo presente na implementação atual:

```javascript
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

Outro exemplo:

```javascript
const err = new Error('Usuário não autenticado.');
err.status = 401;
throw err;
```

Esse padrão está distribuído entre diferentes serviços da aplicação.

A implementação atual funciona corretamente e permite que os erros sejam tratados pela API. Entretanto, a estrutura responsável por representar os erros controlados da aplicação está descentralizada.

Cada serviço precisa conhecer e definir manualmente como um erro será criado e quais propriedades adicionais serão adicionadas ao objeto.

---

## 2. Funcionamento da Implementação Atual

Atualmente, quando uma regra de negócio identifica uma situação inválida, inexistente ou não autorizada, o próprio serviço é responsável por construir manualmente o objeto de erro.

O processo normalmente ocorre da seguinte forma:

1. Criar um objeto utilizando a classe nativa `Error`;
2. Definir a mensagem do erro;
3. Adicionar manualmente a propriedade `status`;
4. Lançar a exceção utilizando `throw`.

Exemplo:

```javascript
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

Esse mesmo padrão aparece em diferentes situações do sistema.

### Exemplos identificados

No `animaisService.js`:

```javascript
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

No `agendamentosService.js`:

```javascript
const err = new Error('Este horário já está ocupado para a data selecionada. Escolha outro horário.');
err.status = 409;
throw err;
```

No `usuariosService.js`:

```javascript
const e = new Error('E-mail já cadastrado.');
e.status = 409;
throw e;
```

No `favoritosService.js`:

```javascript
const err = new Error('Favorito não encontrado.');
err.status = 404;
throw err;
```

Portanto, a responsabilidade pela criação e configuração da estrutura dos erros está distribuída entre diferentes componentes da camada de serviços.

---

## 3. Mudança Futura de Referência

A mudança futura utilizada como referência neste diagnóstico é a necessidade de padronizar e ampliar a estrutura dos erros retornados pela API.

Um cenário plausível para a evolução do sistema seria a necessidade de incluir informações adicionais nos erros, como:

* código interno do erro;
* categoria do erro;
* identificação da origem;
* detalhes adicionais;
* informações específicas para clientes externos;
* padronização das respostas da API.

Por exemplo, futuramente a aplicação poderia precisar trabalhar com uma estrutura de erro como:

```json
{
  "status": 404,
  "code": "ANIMAL_NOT_FOUND",
  "message": "Animal não encontrado."
}
```

Essa mudança é plausível para o Whiskerworld caso o sistema passe a possuir novos clientes, integrações externas ou uma necessidade maior de padronização da comunicação da API.

Além disso, uma estrutura centralizada de erros poderia facilitar a futura inclusão de novos tipos de informações sem exigir mudanças na forma como cada serviço constrói seus erros.

---

## 4. Dificuldade de Manutenção Encontrada

Caso a mudança futura de referência seja necessária utilizando a implementação atual, algumas dificuldades poderão ocorrer.

### 4.1 Alterações distribuídas

Atualmente, a criação dos erros está distribuída entre diferentes serviços.

Caso seja necessário modificar a estrutura dos erros, diversos pontos do sistema poderão precisar ser analisados e alterados.

Por exemplo, se futuramente todos os erros controlados precisarem possuir um código interno, será necessário revisar os diferentes locais onde os objetos `Error` são criados manualmente.

### 4.2 Maior impacto da mudança

A estrutura atual aumenta a quantidade de componentes envolvidos em uma alteração relacionada ao tratamento de erros.

Uma mudança que deveria estar concentrada na definição de como os erros são representados pode exigir modificações em vários serviços.

Isso aumenta o esforço necessário para implementar uma evolução futura.

### 4.3 Risco de inconsistências

Como a criação dos erros é realizada manualmente em diferentes pontos do sistema, existe o risco de futuras implementações utilizarem estruturas diferentes.

Por exemplo, diferentes desenvolvedores poderiam utilizar propriedades ou formatos distintos para representar informações relacionadas ao erro.

A descentralização da responsabilidade dificulta a garantia de uma estrutura única e consistente.

### 4.4 Duplicação de responsabilidade

Os serviços possuem como principal responsabilidade a implementação das regras de negócio da aplicação.

Entretanto, atualmente eles também precisam conhecer detalhes sobre como os erros são estruturalmente representados, incluindo a criação do objeto e a definição do status HTTP.

Essa responsabilidade está repetida em diversos componentes.

### 4.5 Maior esforço para evolução futura

Quanto maior a quantidade de locais responsáveis por construir manualmente objetos de erro, maior será o esforço necessário para alterar ou ampliar a estrutura das exceções.

A mudança futura poderá exigir a revisão de vários arquivos, aumentando o risco de esquecimentos e regressões.

---

## 5. Fundamentação Teórica

A intervenção proposta está relacionada aos conceitos apresentados no Capítulo 4 — Código Flexível a Mudanças, do livro *Fundamentos de Manutenção de Software*, de Marco Tulio Valente.

### Ocultamento de Informação

O ocultamento de informação consiste em esconder detalhes internos de implementação que não precisam ser conhecidos por outros componentes do sistema.

No contexto identificado, os detalhes relacionados à estrutura interna dos erros estão atualmente expostos aos serviços.

Cada serviço precisa conhecer como criar um objeto de erro e como adicionar propriedades relacionadas ao status HTTP.

Com uma classe específica para representar erros da aplicação, esses detalhes podem ser encapsulados.

Os serviços passam a informar apenas as informações necessárias para representar o problema, enquanto a classe responsável define internamente a estrutura do erro.

### Redução do Impacto das Mudanças

Uma estrutura centralizada permite que futuras alterações relacionadas à representação dos erros sejam realizadas com menor impacto no sistema.

Caso seja necessário adicionar novas propriedades ou modificar o comportamento dos erros, a alteração poderá ser concentrada principalmente em um único componente responsável por essa estrutura.

Isso reduz a quantidade de arquivos potencialmente afetados por mudanças futuras.

### Separação de Responsabilidades

A criação e padronização das exceções podem ser atribuídas a um componente específico.

Dessa forma, os serviços permanecem concentrados nas regras de negócio, enquanto a estrutura dos erros fica centralizada.

Essa separação reduz o acoplamento entre os serviços e os detalhes de implementação relacionados à representação das exceções.

---

## 6. Proposta de Intervenção Preventiva

A manutenção preventiva proposta consiste na criação de uma classe centralizada denominada `AppError`.

Essa classe será responsável por representar os erros controlados da aplicação.

A intervenção proposta deverá incluir:

1. Criar o arquivo `backend/src/errors/AppError.js`;
2. Definir uma estrutura padronizada para os erros controlados da aplicação;
3. Centralizar propriedades como mensagem e status HTTP;
4. Refatorar os serviços selecionados para utilizar a nova classe;
5. Preservar o comportamento funcional atual do sistema;
6. Garantir que os erros continuem retornando os status HTTP esperados.

A utilização esperada será semelhante ao seguinte exemplo:

```javascript
throw new AppError('Animal não encontrado.', 404);
```

Dessa forma, os serviços deixam de criar manualmente objetos utilizando `Error` e de definir individualmente propriedades relacionadas ao status HTTP.

---

## 7. Relação ANTES → MANUTENÇÃO PREVENTIVA → DEPOIS

### ANTES

Atualmente, cada serviço cria manualmente seus próprios objetos de erro.

Exemplo:

```javascript
const err = new Error('Animal não encontrado.');
err.status = 404;
throw err;
```

Essa lógica está distribuída entre diferentes arquivos da camada de serviços:

```text
backend/src/services/
├── animaisService.js
├── agendamentosService.js
├── usuariosService.js
└── favoritosService.js
```

Cada um desses componentes conhece detalhes sobre a criação e estrutura dos erros.

---

### MANUTENÇÃO PREVENTIVA

A intervenção consistirá na criação de um componente específico para centralizar a representação dos erros da aplicação.

Estrutura proposta:

```text
backend/src/errors/
└── AppError.js
```

A classe `AppError` será responsável por definir a estrutura padrão dos erros controlados da aplicação.

Os serviços passarão a utilizar essa abstração em vez de criar manualmente objetos `Error` e adicionar propriedades individualmente.

---

### DEPOIS

Após a intervenção, a criação de erros poderá ocorrer da seguinte forma:

```javascript
throw new AppError('Animal não encontrado.', 404);
```

Os serviços passam a utilizar uma estrutura centralizada e reutilizável.

A definição interna das propriedades do erro permanece encapsulada na classe `AppError`.

---

## 8. Evidência Esperada da Melhoria

A principal evidência estrutural será a comparação entre a situação antes e depois da intervenção.

### Antes da intervenção

A criação e configuração dos erros está distribuída em múltiplos serviços.

Os componentes precisam:

* criar objetos utilizando `Error`;
* definir mensagens individualmente;
* adicionar manualmente propriedades como `status`;
* conhecer detalhes da estrutura utilizada para representar as exceções.

A análise inicial identificou esse padrão nos seguintes serviços:

* `animaisService.js`;
* `agendamentosService.js`;
* `usuariosService.js`;
* `favoritosService.js`.

### Depois da intervenção

Os serviços passarão a utilizar uma abstração única para representar os erros controlados da aplicação.

Exemplo:

```javascript
throw new AppError('Animal não encontrado.', 404);
```

Uma futura alteração na estrutura interna dos erros poderá ser concentrada principalmente no arquivo:

```text
backend/src/errors/AppError.js
```

Dessa forma, a mudança futura de referência poderá ser realizada com menor impacto sobre os serviços da aplicação.

A melhoria estrutural será demonstrada pela redução da responsabilidade dos serviços em definir manualmente a estrutura das exceções.

---

## 9. Conclusão do Diagnóstico

O problema identificado não representa um defeito funcional existente no Whiskerworld.

O sistema atualmente funciona e realiza o tratamento das situações de erro por meio da criação de objetos `Error` e da definição manual do status HTTP.

Entretanto, a estrutura atual distribui a criação e configuração dos erros entre diferentes serviços da aplicação.

Essa característica pode aumentar o esforço, o impacto e o risco de manutenção caso futuramente seja necessário alterar ou ampliar a estrutura das exceções retornadas pela API.

A manutenção proposta busca antecipar essa possível dificuldade por meio da centralização da estrutura dos erros em uma classe específica denominada `AppError`.

A intervenção será realizada antes que a mudança futura seja necessária e tem como objetivo reduzir o impacto, o esforço e o risco associados à evolução do tratamento de erros da aplicação.

Portanto, a alteração caracteriza-se como uma intervenção de manutenção preventiva, pois o sistema atualmente apresenta comportamento funcional correto, mas possui uma característica estrutural que pode dificultar mudanças futuras. A intervenção proposta busca reduzir essa dificuldade antecipadamente, tornando o código mais flexível e preparado para evolução.
