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

## Pré-requisitos

Antes de começar, certifique-se de que a sua máquina possui os seguintes componentes instalados:

* **Java Development Kit (JDK) 17**: Necessário para rodar o Spring Boot.
* **Git**: Para clonar o repositório.
* **NGINX** (Opcional, mas recomendado): Para testar o balanceamento de carga na porta 80.
* **Thunder Client / Postman**: Para disparar requisições e testar a API.

*(Nota: O banco de dados PostgreSQL já está hospedado em nuvem via **Supabase**, então você não precisa instalar nenhum banco de dados localmente!)*

---

## Passo 1: Configuração do Ambiente

1. **Clone o repositório** para a sua máquina:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd conecta-a-vida-api
   ```

2. **Verifique as variáveis de ambiente**:
   Acesse o arquivo `src/main/resources/application.properties`. A conexão com o Supabase já está configurada de forma nativa. Garanta que o CORS permite a comunicação com o front-end e o NGINX:
   ```properties
   app.security.allowed-origins=${CONECTA_CORS_ORIGINS:http://localhost:5173,http://localhost:3000,http://localhost:4000,http://localhost}
   ```

---

## Passo 2: Executando a Aplicação (Modo Simples)

Para rodar a aplicação no modo padrão (uma única instância na porta `8080`), abra o terminal na pasta raiz do projeto e execute o Wrapper do Gradle:

**No Windows:**
```cmd
gradlew.bat bootRun
```

**No Linux / macOS:**
```bash
chmod +x gradlew
./gradlew bootRun
```

A API estará disponível em: `http://localhost:8080`

---

## Passo 3: Executando com Balanceamento de Carga (NGINX)

Para replicar o ambiente de produção (Cenário B dos testes do JMeter), precisamos subir **duas instâncias** da API e usar o NGINX para distribuir o tráfego.

### 1. Suba a Instância 1 (Porta 8080)
Abra um terminal e rode:
```bash
./gradlew bootRun
```

### 2. Suba a Instância 2 (Porta 8081)
Abra um **segundo terminal** na mesma pasta e rode o projeto alterando a porta dinamicamente:
```bash
./gradlew bootRun --args='--server.port=8081'
```

### 3. Configure e Inicie o NGINX
1. Baixe o NGINX para o seu sistema operacional.
2. Substitua o arquivo `conf/nginx.conf` da instalação do NGINX pelo arquivo de configuração fornecido na pasta `documentacao/conf_nginx.zip` do nosso repositório.
3. Inicie o NGINX (no Windows, basta dar um duplo clique em `nginx.exe` ou rodar `start nginx` no terminal).

Agora, a sua API estará respondendo balanceada na porta 80.
**URL Base da API Balanceada:** `http://localhost/api`

---

## Passo 4: Testando as Rotas

Com a aplicação rodando (com ou sem NGINX), você pode testar se tudo está funcionando abrindo o navegador ou o Thunder Client e acessando:

* **Status e Métricas:** `GET http://localhost:8080/api/dashboard/stats`
* **Listar Usuários:** `GET http://localhost:8080/api/usuarios`
* **Listar Notícias:** `GET http://localhost:8080/api/comunicacoes`

Entre outras rotas!

*(Se estiver usando o NGINX, troque `8080` apenas por `localhost`)*

---

## Passo 5: Compilando para Produção

Se você precisar gerar o arquivo executável `.jar` final para fazer o deploy em um servidor em nuvem (como AWS, Heroku ou Railway), execute:

**No Windows:**
```cmd
gradlew.bat bootJar
```

**No Linux / macOS:**
```bash
./gradlew bootJar
```

© 2026 Conecta à Vida. Sistema homologado para fins acadêmicos. IFSP Bragança Paulista.

