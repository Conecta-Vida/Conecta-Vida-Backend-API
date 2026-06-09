# 💉 Conecta à Vida - Painel de Controlo e API de Saúde Pública

<p align="center">
<strong>Um ecossistema digital unificado focado no gerenciamento de dados de saúde pública, comunicação de crises e engajamento comunitário. Integra uma API robusta em Java com Spring Boot e uma interface administrativa Single Page Application (SPA) reativa em React com TypeScript.</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17">
<img src="https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.0.5">
<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19.2.4">
<img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

-----

## 👥 Autores e Instituição
* **Luiz Henrique Gonçalves**
* **Gustavo** 
* **Gabriel** 
* **Renan** 
* **Maycon** 

**IFSP - Câmpus Bragança Paulista** *Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas*

-----

## 📖 Sobre o Projeto e Detalhamento do Tema

Em cenários de saúde pública, a descentralização das informações gera gargalos graves: atrasos na resposta a surtos epidemiológicos, desinformação em massa sobre cronogramas de vacinação e superlotação inadequada da infraestrutura médica municipal.

O **Conecta à Vida** é uma plataforma desenvolvida para sanar essa lacuna, atuando como o canal oficial de monitoramento e controle entre os órgãos reguladores de saúde (Hospitais, UPAs, UBSs) e a população civil. O sistema adota uma arquitetura desacoplada dividida em duas frentes integradas:

1. **API REST (Backend):** Concentra o cérebro analítico do sistema, gerenciando auditorias imutáveis, persistência em nuvem, controle volumétrico de dados e segurança contra invasões.
2. **Painel Administrativo (Frontend):** Uma interface corporativa ágil baseada no conceito de *Design Semântico*, onde cores e formas indicam o nível de gravidade das notificações de crise.

-----

## ✨ Funcionalidades e Casos de Uso

### 🔐 A. Segurança e Antifraude (Módulo de Autenticação)
* **Controle de Acesso Restrito:** Bloqueio de rotas privadas. Apenas utilizadores que possuam o cargo ou localização `"Administrador"` têm a sessão autorizada no ecossistema.
* **Sistema Anti-Intrusão:** Monitoramento ativo em memória do servidor via `ConcurrentHashMap`. Se um mesmo e-mail falhar na autenticação **3 vezes consecutivas**, a API bloqueia provisoriamente a rota e dispara automaticamente um e-mail de alerta em tempo real (via SMTP/TLS) contendo os detalhes da tentativa de invasão para a chefia.

### 📊 B. Dashboard e Monitoramento Analítico
* **Métricas Consolidadas:** Cards operacionais exibindo o total de cidadãos, alertas abertos, campanhas preventivas ativas e notícias publicadas de forma vitalícia.
* **Gráfico de Crescimento:** Histórico gráfico interativo que demonstra o volume de adesão de novos utilizadores ao longo dos meses na base de dados.
* **Linha do Tempo (Audit Log):** Exibição cronológica das 5 últimas ações técnicas capturadas pelo sistema para rastreabilidade completa das ações da equipa.

### 👥 C. Gestão de Cidadãos (Usuários)
* **CRUD Completo:** Listagem, cadastro, edição e remoção de dados demográficos da população.
* **Operações em Lote (CSV):** Mecanismo de alta performance capaz de ler planilhas `.csv` enviadas pela interface e salvar centenas de utilizadores em um único lote de inserção (`saveAll`) para economizar conexões de rede com o Supabase.
* **Motor de Documentos:** Geração assíncrona de relatórios analíticos de utilizadores formatados em PDF em tempo real, utilizando a biblioteca **iText 7**.

### 🏥 D. Infraestrutura de Unidades de Saúde
* **Mapeamento Descentralizado:** Cadastro de pontos de pronto atendimento classificados por categoria (Hospital Geral, UPA, Posto de Saúde, UBS).
* **Controle de Cronogramas:** Definição pública e gerenciamento dos horários operacionais segmentados por dias úteis, sábados e domingos.

### 📢 E. Central de Comunicação de Crises
* **Alertas Emergenciais:** Disparo de notificações de urgência geolocalizadas (surtos de endemias, contaminações) contendo flags de controle de leitura.
* **Campanhas e Informativos:** Publicação e curadoria de campanhas preventivas (doação de sangue, mutirões de vacinação) com filtros por data, localização e público-alvo.

-----

## 🛠️ Tecnologias Utilizadas

### **Backend (API)**
* **Linguagem Principal:** Java 17 (OpenJDK)
* **Framework:** Spring Boot 4.0.5
* **Camada de Persistência:** Spring Data JPA / Hibernate
* **Motor de Relatórios:** iText 7 Core 7.2.5
* **Ferramenta de Automação:** Gradle
* **Gerenciamento de Código Limpo:** Lombok
* **Serviço de Mensageria:** JavaMailSender (SMTP/TLS)

### **Frontend (Administrativo)**
* **Biblioteca Core:** React 19.2.4
* **Linguagem:** TypeScript 5.9.3 (Tipagem Estática Avançada)
* **Ferramenta de Build:** Vite 8.0.1
* **Roteamento de Aplicação:** React Router Dom 7.13.2
* **Estilização e Design:** Tailwind CSS 4.2.2
* **Pacote de Ícones:** Lucide React
* **Feedback Flutuante:** Sonner (Toast Notification Management)

-----

## 🎨 Estrutura Visual e Fluxo de Navegação

O frontend foi desenvolvido como uma **Single Page Application (SPA)** otimizada com **Lazy Loading (Code Splitting)**, descarregando os ficheiros das páginas sob demanda na rede apenas quando clicados, utilizando componentes `<Suspense>` para garantir transições fluidas sem travamentos.

### 🗺️ Mapa Lógico de Roteamento

```text
                      [ Usuário acessa o Painel ]
                                   │
                                   ▼
                        [ App.tsx (Roteador) ]
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                     ▼
      [ Rota Pública: /login ]             [ Rotas Privadas ]
                │                                     │
        (Autenticação OK)                             ▼
                │                         [ Componente RotaProtegida ]
                │                                     │
                │                         ┌───────────┴───────────┐
                │                         ▼ (Sem Sessão)          ▼ (Sessão OK)
                │                  [ Expele para /login ]     [ Carrega AppLayout ]
                │                                                     │
                └─────────────────────────────────────────────────────┼────────────────────────┐
                                                                      │                        │
                                   ┌──────────────────┬───────────────┼───────────────┐        │
                                   ▼                  ▼               ▼               ▼        ▼
                            [ / (Dashboard) ]   [ /usuarios ]  [ /instituicoes ] [ /campanhas ] [ /alertas ]
                                                                                      │
                                                                                      ▼
                                                                             [ /campanhas/:id ]
```
---

## 🗄️ Estrutura do Banco de Dados (Esquema PostgreSQL)

Abaixo estão descritos os dicionários e estruturas das tabelas físicas relacionais ativas na base de dados.

### 1. Tabela: `usuarios`

```sql
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    idade INTEGER,
    sexo VARCHAR(50),
    localizacao VARCHAR(255) -- Usado como Role/Permissão. Se 'Administrador', libera o painel.
);

```

### 2. Tabela: `instituicoes_saude`

```sql
CREATE TABLE instituicoes_saude (
    id BIGSERIAL PRIMARY KEY,
    tipo_instituicao VARCHAR(50) NOT NULL, -- 'UNIDADE', 'HOSPITAL', 'UPA', 'POSTO'
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(50),
    linksite VARCHAR(255),
    endereco VARCHAR(255),
    horario_seg_sex VARCHAR(100),
    horario_sabado VARCHAR(100),
    horario_domingo VARCHAR(100)
);

```

### 3. Tabela Polimórfica: `comunicacoes`

```sql
CREATE TABLE comunicacoes (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Diferenciador estrutural: 'ALERTA', 'CAMPANHA', 'NOTICIA'
    instituicao_id BIGINT REFERENCES instituicoes_saude(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100), -- Ex: 'urgente', 'vacinação'
    linkimagem VARCHAR(255),
    localizacao VARCHAR(255), -- Região ou bairro afetado
    publico_alvo VARCHAR(255),
    status VARCHAR(50), -- Ex: 'Ativa', 'Encerrada'
    lido BOOLEAN DEFAULT false, -- Baixa de leitura em alertas críticos
    data_postada TIMESTAMP DEFAULT NOW(),
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP
);

```

### 4. Tabela de Auditoria: `logs_atividade`

```sql
CREATE TABLE logs_atividade (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    acao VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP DEFAULT NOW()
);

```

---

## ⚙️ Instalação, Configuração e Execução

### 1. Inicialização da Base de Dados

Certifique-se de possuir um servidor PostgreSQL ativo (local ou via Supabase) e execute o comando de criação:

```sql
CREATE DATABASE conecta_a_vida_db;

```

### 2. Configuração do Ambiente Backend (Spring Boot)

Aceda ao ficheiro `src/main/resources/application.properties` do seu projeto Java e ajuste as credenciais de banco e do servidor de e-mails:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/conecta_a_vida_db
spring.datasource.username=seu_usuario_postgres
spring.datasource.password=sua_senha_postgres

# Configuração automática do Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# ===================================================================
# CONFIGURAÇÃO DO SERVIDOR DE E-MAIL (MÓDULO ANTI-INTRUSÃO)
# ===================================================================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email_remetente@gmail.com
spring.mail.password=sua_senha_de_aplicativo_google
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

```

#### ✉️ Guia Importante sobre os Alertas de E-mail:

O sistema possui uma rotina de segurança que dispara um e-mail automático após **3 erros consecutivos** de senha de um utilizador.

* **Configuração de Credenciais:** O campo `spring.mail.password` **NÃO** deve receber a sua senha comum do e-mail. Para contas Gmail, é mandatório aceder às configurações da sua Conta Google, ativar a "Autenticação em Duas Etapas" e gerar uma **"Senha de Aplicativo"** exclusiva de 16 dígitos.
* **Tratamento de Exceções em Execução:** Caso as credenciais SMTP estejam erradas ou o servidor local esteja sem acesso à internet externa na hora dos disparos, a aplicação irá imprimir um aviso descritivo de erro (`MailException`) no terminal Java (`System.out.println`), mas **não irá derrubar ou congelar a API**, garantindo que o restante das operações do painel continue funcional.

Abra o terminal dentro da pasta raiz do backend e execute a aplicação via Gradle wrapper:

```bash
# No Windows
gradlew.bat bootRun

# No Linux ou Mac
chmod +x gradlew
./gradlew bootRun

```

* A API será iniciada com sucesso em `http://localhost:8080`.

### 3. Configuração do Ambiente Frontend (React + Vite)

Para garantir que o TypeScript compile perfeitamente e sem erros de importação com ficheiros de estilos CSS (`index.css`), garanta que o ficheiro global de definição do Vite exista na raiz da pasta `src/`:

**Ficheiro:** `src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />

```

Abra o terminal dentro da pasta raiz do seu frontend (`conecta-a-vida-administrativo`) e execute os comandos de instalação de pacotes e inicialização do servidor de desenvolvimento:

```bash
npm install
npm run dev

```

* O painel administrativo abrirá no seu navegador de forma automática através do endereço: `http://localhost:5173`.

© 2026 Conecta à Vida. Sistema homologado para fins acadêmicos. IFSP Bragança Paulista.

