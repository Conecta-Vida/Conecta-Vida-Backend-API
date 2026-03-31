CREATE TABLE orgaos_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255)
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_perfil VARCHAR(20) NOT NULL, 
    orgao_id INTEGER REFERENCES orgaos_saude(id) 
);

CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    data_vencimento TIMESTAMP,
    data_evento TIMESTAMP,
    orgao_id INTEGER REFERENCES orgaos_saude(id) NOT NULL
);