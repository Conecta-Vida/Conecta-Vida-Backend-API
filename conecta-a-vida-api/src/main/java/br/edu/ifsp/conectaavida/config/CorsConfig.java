package br.edu.ifsp.conectaavida.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * FILTRO CORS (CROSS-ORIGIN RESOURCE SHARING)
 * Explicação para o grupo: Por padrão, o navegador bloqueia que um site (React na porta 5173)
 * converse com uma API (Spring Boot na porta 8080) por estarem em portas diferentes.
 * Esta classe quebra esse bloqueio de segurança local, permitindo tráfego multiplataforma
 * (React Web, Emulador Android, Postman e JMeter) livremente.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Estende o direito de acesso para todas as URLs da API
                .allowedOrigins("*") // Permite requisições vindas de qualquer IP ou porta externa
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Libera os verbos HTTP completos
                .allowedHeaders("*"); // Permite o envio de qualquer cabeçalho de metadados (como o Token)
    }
}