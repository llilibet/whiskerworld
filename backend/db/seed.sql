USE whiskerworld;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM favoritos;
DELETE FROM agendamentos;
DELETE FROM animais;
DELETE FROM usuarios;
ALTER TABLE favoritos AUTO_INCREMENT = 1;
ALTER TABLE agendamentos AUTO_INCREMENT = 1;
ALTER TABLE animais AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
SET FOREIGN_KEY_CHECKS = 1;

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
