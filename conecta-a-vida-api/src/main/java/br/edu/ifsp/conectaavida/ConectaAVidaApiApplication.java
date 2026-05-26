package br.edu.ifsp.conectaavida;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * CLASSE PRINCIPAL: ConectaAVidaApiApplication
 * Objetivo: Funcionar como o ponto de partida (Entry Point) e o cérebro de inicialização da API.
 * * 💡 Nota Didática para a Equipa sobre a anotação @SpringBootApplication:
 * Esta é uma das anotações mais poderosas do Spring. Diga aos seus colegas que, por baixo dos panos,
 * ela ativa três mecanismos cruciais de uma só vez:
 * * 1. @Configuration: Permite que esta classe registre e configure novos componentes manualmente no sistema.
 * 2. @EnableAutoConfiguration: Faz o Spring ler o arquivo 'application.properties' e configurar sozinho
 * as dependências (como a ligação JDBC do Supabase e o servidor de e-mails JavaMailSender).
 * 3. @ComponentScan: Diz ao Spring para varrer todas as pastas e subpastas a partir daqui (domain, repository,
 * service, controller) para encontrar e instanciar as classes marcadas com @RestController, @Service, etc.
 */
@SpringBootApplication
public class ConectaAVidaApiApplication {

    /**
     * O método main é o ponto de entrada oficial exigido pela Máquina Virtual do Java (JVM).
     * Quando o projeto é executado, a JVM procura exatamente por esta assinatura para começar.
     * * @param args Parâmetros externos de linha de comando que podem ser passados ao inicializar o jar.
     */
    public static void main(String[] args) {

        /*
         * SpringApplication.run(): O comando que inicializa toda a mágica.
         * Ele executa os seguintes passos automáticos:
         * 1. Cria o ApplicationContext (o container que gerencia todos os objetos/beans do projeto).
         * 2. Inicializa o servidor web embutido (Apache Tomcat) na porta 8080.
         * 3. Expõe os endpoints REST configurados nos controladores para o Frontend React consumir.
         */
        SpringApplication.run(ConectaAVidaApiApplication.class, args);
    }

}