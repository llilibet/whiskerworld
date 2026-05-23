CREATE DATABASE IF NOT EXISTS whiskerworld
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE whiskerworld;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS animais;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  tipo ENUM('ADMIN','ADOTANTE') NOT NULL DEFAULT 'ADOTANTE',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE animais (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  idade VARCHAR(50),
  sexo ENUM('MACHO','FEMEA') NOT NULL,
  vacinado TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('DISPONIVEL','EM_PROCESSO','ADOTADO') NOT NULL DEFAULT 'DISPONIVEL',
  tipo ENUM('CAO','GATO') NOT NULL,
  raca VARCHAR(100),
  porte ENUM('PEQUENO','MEDIO','GRANDE'),
  descricao TEXT,
  historico TEXT,
  foto_url VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_animais_tipo_status (tipo, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE agendamentos (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  animal_id INT NOT NULL,
  data_visita DATE NOT NULL,
  hora_visita TIME NOT NULL,
  status ENUM('PENDENTE','CONFIRMADO','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_agendamentos_usuario (usuario_id),
  KEY idx_agendamentos_animal (animal_id),
  KEY idx_agendamentos_data_hora (data_visita, hora_visita),
  CONSTRAINT fk_agendamento_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_agendamento_animal
    FOREIGN KEY (animal_id) REFERENCES animais (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE favoritos (
  id INT NOT NULL AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  animal_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uc_favorito (usuario_id, animal_id),
  KEY idx_favoritos_animal (animal_id),
  CONSTRAINT fk_favoritos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_favoritos_animal
    FOREIGN KEY (animal_id) REFERENCES animais (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios (id, nome, email, senha_hash, tipo, created_at) VALUES
(1, 'Lilica', 'lili@whiskerworld.com', '$2b$10$38wRUHIy2l9hh9emzEBtT.zGBZV71hk.L93CKZTW7YVRBhnypDpzm', 'ADOTANTE', '2026-03-30 10:00:00'),
(2, 'Admin Whiskerworld', 'admin@whiskerworld.com', '$2b$10$93BMbWG5qoxjh/wcUk0Lg.d.iBmNnlVLwY8KHhD/qmApkvNkP4ERm', 'ADMIN', '2026-03-30 10:05:00');

INSERT INTO animais
  (id, nome, idade, sexo, vacinado, status, tipo, raca, porte, descricao, historico, foto_url, created_at)
VALUES
  (1, 'Gatuno', '3 anos', 'MACHO', 1, 'DISPONIVEL', 'GATO', 'SRD', 'MEDIO',
   'Gato brincalhao, curioso e acostumado com ambientes internos.',
   'Resgatado em feira local; vermifugado e vacinado.',
   '/uploads/animais/gatuno-1764082743828.jpg', '2026-03-30 10:10:00'),
  (2, 'Platao', '2 meses', 'MACHO', 1, 'DISPONIVEL', 'CAO', 'SRD', 'PEQUENO',
   'Filhote gentil, dorminhoco e sociavel.',
   'Resgatado com a ninhada; primeira rodada de vacinas aplicada.',
   '/uploads/animais/platao-1764036003653.jpg', '2026-03-30 10:20:00'),
  (3, 'Banguela', '3 meses', 'MACHO', 1, 'DISPONIVEL', 'GATO', 'SRD', 'PEQUENO',
   'Agitado, carinhoso e gosta de brincar.',
   'Recebeu atendimento veterinario preventivo.',
   '/uploads/animais/banguela-1764029980357.jpg', '2026-03-30 10:30:00'),
  (4, 'Pericles', '5 meses', 'MACHO', 1, 'DISPONIVEL', 'CAO', 'SRD', 'MEDIO',
   'Dorminhoco, companheiro e tranquilo.',
   'Resgatado em via publica; acompanhamento de saude sem pendencias.',
   '/uploads/animais/pericles-1764034966768.jpg', '2026-03-30 10:40:00'),
  (5, 'Kitty', '5 meses', 'FEMEA', 0, 'DISPONIVEL', 'GATO', 'SRD', 'PEQUENO',
   'Curiosa, brincalhona e independente.',
   'Em acompanhamento para completar calendario de vacinas.',
   '/uploads/animais/kitty-1764082937619.jpg', '2026-03-30 10:50:00');

INSERT INTO agendamentos
  (id, usuario_id, animal_id, data_visita, hora_visita, status, observacoes, created_at)
VALUES
  (1, 1, 3, '2026-04-10', '08:00:00', 'CONFIRMADO', 'Visita inicial para conhecer o Banguela.', '2026-03-30 11:00:00');

INSERT INTO favoritos (id, usuario_id, animal_id, created_at) VALUES
  (1, 1, 1, '2026-03-30 11:10:00');
