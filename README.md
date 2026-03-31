# 💉 Conecta à Vida - Sistema de Gestão de Saúde e Vacinação

<p align="center">
<strong>Uma plataforma digital voltada para a gestão de saúde, notificação de vacinas e campanhas de doação de sangue, integrando um ecossistema robusto com Backend em Java e Frontend dinâmico em React com TypeScript.</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17">
<img src="https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.0.5">
<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19.2.4">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

-----

## 📖 Sobre o Projeto

O **Conecta à Vida** é uma aplicação desenvolvida no **IFSP - Câmpus Bragança Paulista**. O foco do projeto é facilitar o acompanhamento do histórico de saúde dos pacientes, otimizar o fluxo de campanhas (como mutirões de vacinação e doação de sangue) e gerenciar unidades de atendimento. A aplicação adota uma arquitetura desacoplada, utilizando **Java 17** com **Spring Boot** para uma API confiável e **React 19** com **Vite** para uma interface administrativa (SPA) reativa e de alta performance.

-----

## ✨ Funcionalidades

O sistema foi projetado para oferecer um controle gerencial completo para profissionais de saúde e administradores.

### Painel Administrativo:

  - 📊 **Dashboard Gerencial:** Visualização de estatísticas em tempo real, incluindo total de pacientes, vacinas aplicadas e gráficos mensais interativos.
  - 👥 **Gestão de Pacientes:** CRUD completo de pacientes, com suporte avançado para importação em lote via CSV e exportação de relatórios em PDF.
  - 🪪 **Carteira de Vacinação:** Registo detalhado das doses aplicadas, controlando lotes, datas e os profissionais de saúde responsáveis.
  - 📢 **Campanhas e Alertas:** Criação e gestão de campanhas de saúde (ativas, agendadas ou encerradas) e sistema de alertas classificados por urgência.
  - 🏥 **Configuração de Unidade:** Definição de horários de funcionamento, endereços e contatos do posto de saúde.

-----

## 🚀 O que foi Melhorado?

Este projeto incorpora diversas boas práticas de engenharia de software:

  * **Segurança e Tipagem no Frontend:** O uso de **TypeScript** aliado à biblioteca **Zod** garante a validação rigorosa de dados (como formatação de CPF) antes do envio ao servidor.
  * **Geração Nativa de Documentos:** Integração do back-end com a biblioteca **iText7** para a geração dinâmica e formatação profissional de relatórios em PDF.
  * **Interface Acessível:** Estilização desenvolvida com **Tailwind CSS v4** e componentes primitivos do **Radix UI**, garantindo uma interface bonita, responsiva e acessível para todos os utilizadores.
  * **Performance de Desenvolvimento:** Adoção do **Vite** no front-end para builds otimizados e Hot Module Replacement (HMR) quase instantâneo.

-----

## 🧠 Dificuldades Enfrentadas

Durante o desenvolvimento, superámos desafios cruciais de integração:

1.  **Manipulação de Ficheiros:** Implementar o upload de arquivos CSV e a conversão de dados do banco para downloads em PDF de forma fluida entre o Axios e o Spring Boot.
2.  **Mapeamento Objeto-Relacional:** Configurar corretamente o Spring Data JPA / Hibernate para lidar com as chaves estrangeiras entre Pacientes, Vacinas e Registros de Vacinação.
3.  **Ambiente e CORS:** Ajustar a comunicação segura entre o painel web (Vite na porta 5173) e a API (porta 8080).

-----

## 🛠️ Tecnologias Utilizadas

### **Backend (API)**

  - **Linguagem:** Java 17
  - **Framework:** Spring Boot 4.0.5
  - **Persistência:** Spring Data JPA / Hibernate
  - **Base de Dados:** PostgreSQL
  - **Geração de PDF:** iText7 Core 7.2.5
  - **Build Tool:** Gradle
  - **Utilitários:** Lombok

### **Frontend (Administrativo)**

  - **Biblioteca:** React 19.2.4
  - **Linguagem:** TypeScript 5.9.3
  - **Build Tool:** Vite 8.0.1
  - **Roteamento:** React Router Dom 7.13.2
  - **Estilização:** Tailwind CSS 4.2.2
  - **Componentes:** Radix UI / Lucide React
  - **Gráficos:** Recharts 3.8.1

-----

## ⚙️ Começando

### 1\. Base de Dados

Crie o banco de dados no seu PostgreSQL (porta padrão 5432):

```sql
CREATE DATABASE conecta_a_vida_db;
```

### 2\. Configuração do Backend (Spring Boot)

Certifique-se de que as credenciais no ficheiro `conecta-a-vida-api/src/main/resources/application.properties` estão corretas:

  * **URL:** `jdbc:postgresql://localhost:5432/conecta_a_vida_db`
  * **User:** `postgres`
  * **Password:** `20040124` *(Altere para a senha do seu ambiente local, se necessário)*

Abra o terminal na pasta `conecta-a-vida-api` e execute o servidor embutido via Gradle:

```bash
# No Windows
gradlew.bat bootRun

# No Linux/Mac
./gradlew bootRun
```

  * A API estará ativa em: `http://localhost:8080`. O Hibernate (`ddl-auto=update`) criará as tabelas automaticamente.

### 3\. Configuração do Frontend (React)

Navegue até a pasta do frontend `conecta-a-vida-administrativo` e inicie o servidor do Vite:

```bash
cd conecta-a-vida-administrativo
npm install
npm run dev
```

  * A aplicação administrativa abrirá automaticamente no navegador no endereço `http://localhost:5173`.

-----

## 👨‍💻 Autores

Desenvolvido por **Luiz Henrique, Gustavo, Gabriel, Renan e Maycon**
*Estudantes de Análise e Desenvolvimento de Sistemas*
**IFSP - Câmpus Bragança Paulista**

-----

<p align="center">
<img width="1898" height="868" alt="Preview da Aplicação" src="https://github.com/user-attachments/assets/sua-imagem-aqui" />
</p>

© 2026 Conecta à Vida. Todos os direitos reservados.
