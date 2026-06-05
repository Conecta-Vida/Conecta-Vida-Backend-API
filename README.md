# ☕ Conecta à Vida - API Backend RESTful e Barramento de Dados

<p align="center">
<strong>O motor inteligente e barramento de microsserviços RESTful responsável pelo processamento de regras de negócio, persistência física de dados em nuvem, controle volumétrico de dados e auditoria imutável. Fornece endpoints rápidos, assíncronos e tipados tanto para o Painel Administrativo Web (React) quanto para o Aplicativo Móvel do Cidadão (Flutter).</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17">
<img src="https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.0.5">
<img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 17">
<img src="https://img.shields.io/badge/Supabase-Pooler-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
<img src="https://img.shields.io/badge/Gradle-8.x-02303A?style=for-the-badge&logo=gradle&logoColor=white" alt="Gradle">
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

## 📖 Sobre o Módulo Backend (API)

A API REST do **Conecta à Vida** foi projetada sob o padrão arquitetural de camadas isoladas, separando estritamente as responsabilidades de entrada de rede (`Controllers`), validações e criptografia (`Services`), abstração de persistência (`Repositories`) e modelagem física relacional (`Domain`). 

Ela centraliza e processa de forma transacional todas as regras críticas do sistema, garantindo integridade referencial ao se comunicar diretamente com o cluster de alto desempenho do **Supabase (PostgreSQL)** localizado geograficamente na infraestrutura AWS de São Paulo.

-----

## 📦 Dependências e Pré-requisitos do Ecossistema

O ecossistema utiliza o motor de automação e compilação **Gradle**. Ao inicializar o projeto, o barramento baixa de forma automática as seguintes bibliotecas mapeadas no arquivo de build:

### ⚙️ 1. Ambiente Global (Obrigatório na Máquina)
* **Java Development Kit (JDK):** Versão 17 (Recomendado OpenJDK / Microsoft Build)
* **Gerenciador de Ambientes:** Gradle 8.x (Embutido via wrapper local)

### 📚 2. Dependências de Produção (Spring Boot Starters & Core)
* **`spring-boot-starter-web` (v4.0.5):** Engine base para endpoints REST, mapeamento de rotas e servidor embutido Apache Tomcat 11.
* **`spring-boot-starter-data-jpa` (v4.0.5) & `hibernate-core`:** Framework de mapeamento objeto-relacional (ORM) para tradução automática de classes Java em queries SQL nativas.
* **`spring-boot-starter-validation` (v4.0.5):** Mecanismo de validação defensiva de dados (JSR-380 Bean Validation) via anotações em tempo de execução.
* **`spring-boot-starter-mail` (v4.0.5) & `jakarta.mail-api`:** Barramento SMTP para o disparo automatizado de alertas e relatórios via e-mail.
* **`spring-boot-starter-jdbc` & `HikariCP`:** Pool de conexões de alta performance para reaproveitamento de canais ativos com o banco de dados.
* **`postgresql` (v42.7.10):** Driver JDBC nativo para conectividade estável com o PostgreSQL 17 do Supabase.

### 🛠️ 3. Ferramentas Utilitárias e Produtividade
* **`lombok` (v1.18.44):** Processador de anotações em tempo de compilação para injeção automática de Getters, Setters, Construtores e Builders, reduzindo o código boilerplate.
* **`com.itextpdf:kernel` & `layout` (v7.2.5):** Motor gráfico de baixo nível para compilação estruturada e exportação assíncrona de relatórios em formato PDF.
* **`bcpkix-jdk15on` & `bcprov-jdk15on` (Bouncy Castle):** Provedores de segurança criptográfica avançada exigidos pelo iText PDF para manipulação de fluxos de documentos estáveis.

-----

## ✨ Funcionalidades e Casos de Uso da API

### 🔐 A. Módulo de Autenticação e Contingência Anti-Intrusão
* **Controle de Acesso por Nível:** Barramento que intercepta e valida os payloads de login. Apenas usuários cuja flag permissiva seja `"Administrador"` têm o acesso liberado para consumo do painel corporativo.
* **Gatilho de Bloqueio por Força Bruta:** Lógica integrada via cache thread-safe que rastreia os erros sequenciais de senha. Ao atingir o limite de **3 tentativas incorretas**, a conta é provisoriamente suspensa e um e-mail de alerta de auditoria é enviado imediatamente.

### 📊 B. Engine Analítico do Dashboard
* **Agregação Síncrona de Estatísticas:** Endpoints otimizados que executam queries de contagem (`count`) em lote para alimentar os blocos informativos superiores do frontend em milissegundos.
* **Projeção de Gráficos:** Algoritmo de mapeamento que converte as métricas físicas da base de dados em coleções de DTOs estruturadas (Array de pares Chave/Valor) prontas para renderização visual direta.
* **Pipeline de Auditoria Recente:** Consulta ordenada descendente controlada por limite fixo (`findTop5ByOrderByDataHoraDesc`) para abastecer a linha do tempo com os últimos passos técnicos.

### 👥 C. Gerenciamento Populacional e Ingestão CSV
* **Persistência Cadastral:** CRUD completo estruturado sob transações controladas pelo Hibernate.
* **Mecanismo Bulk Ingest (CSV):** Rota de recepção do tipo `MultipartFile` configurada para processar streams de texto planilhados e salvar centenas de cidadãos em uma única transação, otimizando as conexões de rede.
* **Compilação PDF Dinâmica:** Geração assíncrona baseada na renderização de tabelas e metadados via iText PDF, disponibilizando arquivos binários estruturados diretamente no fluxo de resposta HTTP.

### 🏥 D. Infraestrutura Física e Controle de Horários
* **Barramento de Unidades Médicas:** Endpoints dedicados para cadastramento e catalogação de UBSs, Hospitais e Prontos Socorros.
* **Modelagem de Atendimento:** Persistência de grades horárias flexíveis contendo separação semântica para dias de semana, sábados e domingos.

### 📢 E. Central de Emissão de Alertas e Campanhas
* **Notificação Epidemiológica:** Cadastro e despacho de comunicados de urgência com controles condicionais de leitura (`lido = false`).
* **Mutirões Comunitários:** Roteador reativo para criação e modificação pontual de campanhas preventivas (doações de sangue e vacinas) filtradas por data de início e fim.

-----

## 🚀 Funcionalidades Extra e Otimizações de Engenharia

Para elevar a robustez sistêmica e mitigar falhas em ambientes de estresse de infraestrutura, a API incorpora recursos avançados de engenharia de software:

* **⚡ Otimização Concorrente em Memória (Thread-Safe Memory Management):** O mecanismo de rastreamento de tentativas falhas de login utiliza estruturas de `ConcurrentHashMap` em vez de coleções convencionais. Isto assegura que múltiplas requisições paralelas vindas do React e do Flutter de forma simultânea sejam processadas sem risco de condições de corrida (*Race Conditions*) ou concorrência de memória.
* **🛡️ Resiliência SMTP com Isolamento de Falhas (MailException Fault Tolerance):** O microsserviço de mensageria possui tratamento defensivo de exceções globais. Caso as chaves de e-mail estejam incorretas ou o servidor de produção sofra uma queda repentina de conexão com a internet externa no instante do disparo do alerta, a API captura a falha, registra o log descritivo no terminal, **mas não bloqueia ou derruba o pipeline**, mantendo os demais endpoints operantes.
* **🩹 Validação de Dados em Camada Profunda (Bean Validation JSR-380):** Os DTOs de entrada possuem validação defensiva rígida por meio de anotações como `@Email`, `@NotBlank`, `@Size` e `@Positive`. Requisições maliciosas enviadas por fora do painel (via ferramentas como Postman) são interceptadas e barradas na camada HTTP, blindando o banco de dados Supabase contra corrupção de tipos.
* **🚀 Gerenciamento de Pool de Conexões Hikari (Connection Lifecycle Management):** Configuração nativa de tempo de vida e conexões ociosas via HikariCP, assegurando que o barramento Java reutilize os canais abertos com a nuvem do Supabase, diminuindo o overhead de handshake TCP de rede e economizando recursos computacionais.

-----

## 🗄️ Estrutura do Banco de Dados (Esquema Oficial PostgreSQL)

Abaixo está o mapeamento exato da DDL de produção ativa na infraestrutura de nuvem do Supabase:

### 1. Tabela: `usuarios`
```sql
CREATE TABLE public.usuarios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  senha character varying NOT NULL,
  idade integer,
  sexo character varying,
  localizacao character varying,
  permissao character varying NOT NULL DEFAULT 'Usuário Comum'::character varying,
  CONSTRAINT usuarios_pkey PRIMARY KEY (id)
);
```

### 2. Tabela: `instituicoes_saude`

```sql
CREATE TABLE public.instituicoes_saude (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tipo_instituicao character varying NOT NULL,
  nome character varying NOT NULL,
  email character varying,
  telefone character varying,
  linksite character varying,
  endereco character varying,
  horario_seg_sex character varying,
  horario_sabado character varying,
  horario_domingo character varying,
  CONSTRAINT instituicoes_saude_pkey PRIMARY KEY (id)
);

```

### 3. Tabela Polimórfica: `comunicacoes`

```sql
CREATE TABLE public.comunicacoes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tipo character varying NOT NULL,
  instituicao_id bigint,
  titulo character varying NOT NULL,
  descricao text NOT NULL,
  categoria character varying,
  linkimagem character varying,
  localizacao character varying,
  publico_alvo character varying,
  status character varying,
  lido boolean DEFAULT false,
  data_postada timestamp without time zone DEFAULT now(),
  data_inicio timestamp without time zone,
  data_fim timestamp without time zone,
  CONSTRAINT comunicacoes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_comunicacao_instituicao FOREIGN KEY (instituicao_id) REFERENCES public.instituicoes_saude(id)
);

```

### 4. Tabela de Relacionamento Muitos-para-Muitos: `usuarios_campanhas`

```sql
CREATE TABLE public.usuarios_campanhas (
  usuario_id bigint NOT NULL,
  comunicacao_id bigint NOT NULL,
  CONSTRAINT usuarios_campanhas_pkey PRIMARY KEY (usuario_id, comunicacao_id),
  CONSTRAINT usuarios_campanhas_comunicacao_id_fkey FOREIGN KEY (comunicacao_id) REFERENCES public.comunicacoes(id),
  CONSTRAINT usuarios_campanhas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

```

### 5. Tabela de Auditoria: `logs_atividade`

```sql
CREATE TABLE public.logs_atividade (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  usuario_id bigint NOT NULL,
  acao character varying NOT NULL,
  data_hora timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT logs_atividade_pkey PRIMARY KEY (id),
  CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id)
);

```

---

## ⚙️ Instalação, Configuração e Execução

### 1. Configurar o Arquivo Central de Propriedades

Aceda ao diretório `src/main/resources/application.properties` e valide as chaves de injeção externa e fallbacks que mapeiam os recursos de segurança que implementamos:

```properties
# ===================================================================
# CONFIGURAÇÕES DE BLINDAGEM E SEGURANÇA DA API (OWASP REQS)
# ===================================================================
# Tenta ler as variáveis do sistema operacional do servidor. 
# Se não encontrar, assume de forma autônoma os fallbacks de segurança locais.
app.security.salt=${CONECTA_API_SALT:ConectaVida_SecretSalt_2026_IFSP}
app.security.allowed-origins=${CONECTA_CORS_ORIGINS:http://localhost:5173,http://localhost:3000}

```

#### ✉️ Tratamento de Exceções no Módulo de E-mails SMTP

Caso o servidor esteja desconectado da rede externa de internet no instante em que o gatilho de intrusão for disparado por erros de senha, a aplicação capturará e interceptará internamente a falha de entrega de pacotes (`MailException`). O erro será exibido descritivamente por logs de aviso no terminal Java, **mas não irá travar, congelar ou derrubar a API**, garantindo a resiliência contínua dos endpoints para o React e o Flutter.

### 2. Executar a Aplicação localmente via Gradle Wrapper

Abra a pasta raiz do repositório backend no terminal do seu sistema ou IDE e acione o Gradle Wrapper para baixar as dependências e inicializar o Apache Tomcat integrado na porta `8080`:

```bash
# Execução em ambiente operacional Microsoft Windows
gradlew.bat bootRun

# Execução em ambiente operacional Linux ou macOS
chmod +x gradlew
./gradlew bootRun

```

### 3. Compilar o Artefato Standalone de Produção (.jar)

Para compilar todas as classes, rodar os analisadores estáticos e empacotar o microsserviço de forma isolada em um arquivo executável standalone pronto para deploy na nuvem ou proxy reverso (Nginx), execute o comando:

```bash
./gradlew bootJar

```

* O arquivo `.jar` final altamente compactado será gerado de forma bem-sucedida dentro do diretório `/build/libs/`.

---

© 2026 Conecta à Vida. Sistema homologado para fins acadêmicos. IFSP Bragança Paulista.

