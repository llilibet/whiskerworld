-- =====================
-- TIPOS ENUM
-- =====================

CREATE TYPE status_agendamento AS ENUM ('PENDENTE','CONFIRMADO','CANCELADO');
CREATE TYPE sexo_enum AS ENUM ('MACHO','FEMEA');
CREATE TYPE status_animal AS ENUM ('DISPONIVEL','EM_PROCESSO','ADOTADO');
CREATE TYPE tipo_animal AS ENUM ('CAO','GATO');
CREATE TYPE tipo_usuario AS ENUM ('ADMIN','ADOTANTE');

-- =====================
-- TABELA USUARIOS
-- =====================

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  tipo tipo_usuario NOT NULL DEFAULT 'ADOTANTE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- TABELA ANIMAIS
-- =====================

CREATE TABLE animais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade VARCHAR(50),
  sexo sexo_enum NOT NULL,
  vacinado BOOLEAN DEFAULT FALSE,
  status status_animal NOT NULL DEFAULT 'DISPONIVEL',
  tipo tipo_animal NOT NULL,
  descricao TEXT,
  foto_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- TABELA AGENDAMENTOS
-- =====================

CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL,
  animal_id INT NOT NULL,
  data_visita DATE NOT NULL,
  hora_visita TIME NOT NULL,
  status status_agendamento NOT NULL DEFAULT 'PENDENTE',
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_agendamento_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_agendamento_animal
    FOREIGN KEY (animal_id) REFERENCES animais(id)
    ON DELETE CASCADE
);

-- =====================
-- TABELA FAVORITOS
-- =====================

CREATE TABLE favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL,
  animal_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uc_favorito UNIQUE (usuario_id, animal_id),

  CONSTRAINT fk_favoritos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_favoritos_animal
    FOREIGN KEY (animal_id) REFERENCES animais(id)
    ON DELETE CASCADE
);

-- =====================
-- INSERTS
-- =====================

INSERT INTO usuarios (id, nome, email, senha_hash, tipo, created_at) VALUES
(1,'Lilica','lili@whiskerworld.com','$2b$10$Zak6rq/D7wWkTYlApo3b8.4YifVbF6n28Z96Z2B/AZsfJoCwP1iPq','ADOTANTE','2025-11-22 01:05:41'),
(2,'Admin Whiskerworld','admin@whiskerworld.com','$2b$10$X9fl5uoRRrax/8mWlM7It.RiFVptnJ0apUwN5EHeg.s.ongujBv3u','ADMIN','2025-11-22 01:10:23');

INSERT INTO animais (id, nome, idade, sexo, vacinado, status, tipo, descricao, foto_url, created_at) VALUES
(1,'Gatuno','3 anos','MACHO',true,'DISPONIVEL','GATO','Gato brincalhão e curioso.','/uploads/animais/gatuno.jpg','2025-11-22 01:29:43'),
(2,'Platão','2 meses','MACHO',true,'DISPONIVEL','CAO','Gentil e dorminhoco','/uploads/animais/platao.jpg','2025-11-22 01:34:33'),
(3,'Banguela','3 meses','MACHO',true,'DISPONIVEL','GATO','Agitado e carinhoso','/uploads/animais/banguela.jpg','2025-11-24 20:19:40'),
(4,'Periclés','5 meses','MACHO',true,'DISPONIVEL','CAO','Dorminhoco e companheiro','/uploads/animais/pericles.jpg','2025-11-24 21:42:46'),
(5,'Kitty','5 meses','FEMEA',false,'DISPONIVEL','GATO','Curiosa e brincalhona','/uploads/animais/kitty.jpg','2025-11-25 11:02:17');

INSERT INTO agendamentos (id, usuario_id, animal_id, data_visita, hora_visita, status, observacoes, created_at) VALUES
(9,1,3,'2025-11-26','08:00:00','CONFIRMADO',NULL,'2025-11-25 17:45:19');