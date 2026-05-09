package conecta_vida.backend.config;

//arquivo pra permitir rodar esse projeto e o admin ao msm tempo

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a regra para todas as rotas (/api/noticias, /api/usuarios, etc)
                .allowedOrigins("*") // Libera qualquer site/app local para acessar
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*");
    }
}