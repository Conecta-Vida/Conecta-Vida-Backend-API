package conecta_vida.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SegurancaCriptografia {

    //embaralhador de senha
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //o encoder geralmente bloqueai todas as rotas de acesso, pedindo senhas. Abaixo peguei um codigo
    //que deixa as portas abertas, assim n encontramos erros durante o desenvolvimento
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita proteção CSRF (necessário para APIs REST)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Libera TODAS as rotas sem pedir login por enquanto
            );
        
        return http.build();
    }
    
}
