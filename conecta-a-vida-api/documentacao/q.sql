-- ==========================================
-- 1. LIMPEZA DO AMBIENTE (RESET)
-- ==========================================
DROP TABLE IF EXISTS logs_atividade;
DROP TABLE IF EXISTS alertas;
DROP TABLE IF EXISTS campanhas;
DROP TABLE IF EXISTS registros_vacinacao;
DROP TABLE IF EXISTS pacientes;
DROP TABLE IF EXISTS vacinas;

-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS (ESTRUTURA ROBUSTA)
-- ==========================================

CREATE TABLE pacientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    tipagem_sanguinea VARCHAR(3)
);

CREATE TABLE vacinas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    intervalo_doses_dias INTEGER
);

CREATE TABLE registros_vacinacao (
    id BIGSERIAL PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    vacina_id BIGINT NOT NULL,
    nome_vacina VARCHAR(255) NOT NULL,
    data_aplicacao DATE NOT NULL,
    lote VARCHAR(50) NOT NULL,
    profissional_saude VARCHAR(100),
    CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_vacina FOREIGN KEY (vacina_id) REFERENCES vacinas(id)
);

CREATE TABLE campanhas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    publico_alvo VARCHAR(100),
    status VARCHAR(20) -- 'Ativa', 'Encerrada', 'Agendada'
);

CREATE TABLE alertas (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL, -- 'urgente', 'aviso', 'info'
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lido BOOLEAN DEFAULT FALSE
);

CREATE TABLE logs_atividade (
    id BIGSERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    acao TEXT NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. INSERÇÃO DE DADOS PARA TESTES (MOCK DATA)
-- ==========================================

-- Pacientes: Diversas idades para testar a Cartela PNI
INSERT INTO pacientes (nome, cpf, data_nascimento, tipagem_sanguinea) VALUES 
('Luiz Henrique', '111.222.333-44', '2000-05-15', 'O+'),
('Maria Oliveira Silva', '555.666.777-88', '1995-10-22', 'A-'),
('João Pedro (Bebê)', '999.888.777-66', '2025-12-10', 'AB+'),
('Ana Júlia Costa', '222.333.444-55', '2015-08-30', 'O-'),
('Ricardo Pereira (Idoso)', '333.444.555-66', '1958-01-12', 'B+'),
('Gabriel Souza', '444.555.666-77', '1990-07-04', 'A+');

-- Vacinas: Calendário Oficial PNI
INSERT INTO vacinas (nome, descricao, intervalo_doses_dias) VALUES 
('BCG', 'Dose única - Tuberculose', 0),
('Hepatite B', 'Prevenção contra vírus da Hepatite B', 30),
('Pentavalente', 'Difteria, Tétano, Coqueluche e Hib', 60),
('Tríplice Viral', 'Sarampo, Caxumba e Rubéola', 90),
('Gripe (Influenza)', 'Dose anual sazonal', 365),
('COVID-19 (Pfizer)', 'Reforço bivalente', 180);

-- Campanhas: Diferentes status para testar filtros e cards
INSERT INTO campanhas (titulo, descricao, data_inicio, data_fim, publico_alvo, status) VALUES 
('Multivacinação 2026', 'Atualização da caderneta de crianças e adolescentes.', '2026-03-01', '2026-04-30', 'Menores de 15 anos', 'Ativa'),
('Campanha da Gripe', 'Vacinação nacional para grupos prioritários.', '2026-05-01', '2026-06-30', 'Idosos e Gestantes', 'Agendada'),
('Bloqueio Sarampo', 'Ação emergencial devido a surto local.', '2026-01-01', '2026-02-15', 'População Geral', 'Encerrada');

-- Alertas: Para testar as métricas da Dashboard e o Alerta Urgente
INSERT INTO alertas (tipo, titulo, descricao, lido) VALUES 
('urgente', 'Estoque Crítico: BCG', 'Restam apenas 5 ampolas no estoque central.', FALSE),
('aviso', 'Relatório Mensal', 'O relatório de março deve ser enviado até sexta.', FALSE),
('info', 'Sistema Atualizado', 'Novas funcionalidades de gráficos liberadas.', TRUE),
('urgente', 'Surto Detectado', 'Aumento de 20% nos casos de gripe na região.', FALSE);

-- Registros de Vacinação: Datas espalhadas para gerar o Gráfico de Tendência
INSERT INTO registros_vacinacao (paciente_id, vacina_id, nome_vacina, data_aplicacao, lote, profissional_saude) VALUES 
(1, 6, 'COVID-19 (Pfizer)', '2026-01-10', 'PFZ-L01', 'Enf. Ana'),
(2, 6, 'COVID-19 (Pfizer)', '2026-01-15', 'PFZ-L01', 'Enf. Ana'),
(3, 1, 'BCG', '2026-01-20', 'BCG-009', 'Enf. Carlos'),
(4, 2, 'Hepatite B', '2026-02-05', 'HEP-X22', 'Enf. Ana'),
(5, 5, 'Gripe (Influenza)', '2026-02-12', 'FLU-26', 'Enf. Carlos'),
(6, 6, 'COVID-19 (Pfizer)', '2026-03-02', 'PFZ-L02', 'Enf. Ana'),
(1, 2, 'Hepatite B', '2026-03-10', 'HEP-X22', 'Enf. Carlos'),
(3, 2, 'Hepatite B', '2026-03-22', 'HEP-X23', 'Enf. Carlos'),
(2, 5, 'Gripe (Influenza)', '2026-03-25', 'FLU-26', 'Enf. Ana'),
(4, 4, 'Tríplice Viral', '2026-03-28', 'TRP-V01', 'Enf. Ana');

-- Logs de Atividade: Para a lista de "Atividade Recente" na Dashboard
INSERT INTO logs_atividade (usuario, acao, data_hora) VALUES 
('Luiz Admin', 'Cadastrou novo paciente: João Pedro (Bebê)', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
('Enf. Ana', 'Lançou vacina Tríplice Viral para Ana Júlia', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
('Sistema', 'Gerou backup automático do banco de dados', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('Luiz Admin', 'Criou nova campanha: Multivacinação 2026', CURRENT_TIMESTAMP - INTERVAL '1 day');