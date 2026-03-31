-- =============================================================================
-- 1. LIMPEZA DO AMBIENTE (ORDEM CRÍTICA POR CAUSA DAS CHAVES ESTRANGEIRAS)
-- =============================================================================
DROP TABLE IF EXISTS logs_atividade;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS campanhas;
DROP TABLE IF EXISTS registros_vacinacao;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS vacinas;

-- =============================================================================
-- 2. CRIAÇÃO DAS TABELAS (ESTRUTURA ROBUSTA)
-- =============================================================================

-- Tabela de Pacientes
CREATE TABLE pacientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    tipagem_sanguinea VARCHAR(3)
);

-- Tabela de Vacinas (Catálogo PNI)
CREATE TABLE vacinas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    intervalo_doses_dias INTEGER
);

-- Tabela de Registros de Vacinação (Histórico Real)
CREATE TABLE registros_vacinacao (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    vacina_id BIGINT NOT NULL,
    nome_vacina VARCHAR(255) NOT NULL, -- Cache do nome para evitar JOINS pesados
    data_aplicacao DATE NOT NULL,
    lote VARCHAR(50) NOT NULL,
    profissional_saude VARCHAR(100),
    CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id)
);

-- Tabela de Campanhas de Saúde
CREATE TABLE campanhas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    publico_alvo VARCHAR(100),
    status VARCHAR(20) -- Ativa, Encerrada, Agendada
);

-- Tabela de Alertas e Notificações do Sistema
CREATE TABLE alertas (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL, -- urgente, aviso, info
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lido BOOLEAN DEFAULT FALSE
);

-- Tabela de Logs (Auditoria para a Dashboard)
CREATE TABLE logs_atividade (
    id BIGSERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    acao TEXT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. INSERÇÃO DE DADOS DE TESTE (Massa de Dados Robusta)
-- =============================================================================

-- Inserir Pacientes (Diferentes faixas etárias)
INSERT INTO pacientes (nome, cpf, data_nascimento, tipagem_sanguinea) VALUES 
('Luiz Henrique', '111.222.333-44', '2000-05-15', 'O+'),
('Maria Oliveira Silva', '555.666.777-88', '1995-10-22', 'A-'),
('João Pedro (Bebê)', '999.888.777-66', '2025-12-10', 'AB+'),
('Ana Júlia Costa', '222.333.444-55', '2015-08-30', 'O-'),
('Ricardo Pereira (Idoso)', '333.444.555-66', '1958-01-12', 'B+'),
('Gabriel Souza', '444.555.666-77', '1990-07-04', 'A+');

-- Inserir Vacinas Base
INSERT INTO vacinas (nome, descricao, intervalo_doses_dias) VALUES 
('BCG', 'Prevenção contra formas graves de tuberculose', 0),
('Hepatite B', 'Proteção contra o vírus da Hepatite B', 30),
('Pentavalente', 'Difteria, Tétano, Coqueluche e Influenza tipo B', 60),
('Tríplice Viral', 'Sarampo, Caxumba e Rubéola', 90),
('Gripe (Influenza)', 'Vacinação anual sazonal', 365),
('COVID-19 (Pfizer)', 'Esquema vacinal contra SARS-CoV-2', 180);

-- Inserir Registros (Espalhados por meses para o GRÁFICO DA DASHBOARD)
INSERT INTO registros_vacinacao (paciente_id, vacina_id, nome_vacina, data_aplicacao, lote, profissional_saude) VALUES 
(1, 6, 'COVID-19 (Pfizer)', '2026-01-10', 'PFZ-99', 'Enf. Ana'),
(2, 6, 'COVID-19 (Pfizer)', '2026-01-15', 'PFZ-99', 'Enf. Ana'),
(3, 1, 'BCG', '2026-01-20', 'BCG-01', 'Enf. Carlos'),
(4, 2, 'Hepatite B', '2026-02-05', 'HEP-22', 'Enf. Ana'),
(5, 5, 'Gripe (Influenza)', '2026-02-12', 'FLU-26', 'Enf. Carlos'),
(6, 6, 'COVID-19 (Pfizer)', '2026-03-02', 'PFZ-10', 'Enf. Ana'),
(1, 2, 'Hepatite B', '2026-03-10', 'HEP-22', 'Enf. Carlos'),
(3, 2, 'Hepatite B', '2026-03-22', 'HEP-23', 'Enf. Carlos'),
(2, 5, 'Gripe (Influenza)', '2026-03-25', 'FLU-26', 'Enf. Ana'),
(4, 4, 'Tríplice Viral', '2026-03-28', 'TRP-V1', 'Enf. Ana');

-- Inserir Campanhas
INSERT INTO campanhas (titulo, descricao, data_inicio, data_fim, publico_alvo, status) VALUES 
('Multivacinação 2026', 'Atualização da caderneta de vacinação infantil.', '2026-03-01', '2026-04-30', 'Crianças', 'Ativa'),
('Campanha da Gripe', 'Vacinação anual para idosos e profissionais.', '2026-05-01', '2026-06-30', 'Idosos', 'Agendada'),
('Bloqueio Sarampo', 'Ação emergencial contra surto local.', '2026-01-01', '2026-02-15', 'Geral', 'Encerrada');

-- Inserir Alertas
INSERT INTO alertas (tipo, titulo, descricao, lido) VALUES 
('urgente', 'Estoque Crítico: BCG', 'Restam apenas 5 doses na unidade.', FALSE),
('aviso', 'Relatório de Março', 'Prazo de envio encerra dia 05/04.', FALSE),
('info', 'Servidor Estável', 'Manutenção concluída com sucesso.', TRUE),
('urgente', 'Aumento de Casos', 'Surto de gripe detectado no bairro central.', FALSE);

-- Inserir Logs de Atividade
INSERT INTO logs_atividade (usuario, acao, data_hora) VALUES 
('Luiz Admin', 'Cadastrou paciente: João Pedro (Bebê)', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
('Enf. Ana', 'Registrou vacina para Ana Júlia', CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
('Sistema', 'Backup de segurança concluído', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('Luiz Admin', 'Iniciou Campanha Multivacinação', CURRENT_TIMESTAMP - INTERVAL '1 day');