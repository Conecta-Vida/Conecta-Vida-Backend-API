CREATE TABLE orgaos_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    linkSite VARCHAR(255)
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    linkImagem VARCHAR(255) NOT NULL,
    localizacao VARCHAR(100) NOT NULL,
    data_vencimento TIMESTAMP,
    data_evento TIMESTAMP,
    data_postada TIMESTAMP,
    orgao_id INTEGER REFERENCES orgaos_saude(id) NOT NULL
);