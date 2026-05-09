package conecta_vida.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import conecta_vida.backend.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    // O Spring Boot cria o SQL: SELECT * FROM usuarios WHERE email = ? atraves do nome to metodo abaixo
    Optional<Usuario> findByEmail(String email);
    
    // Pesquisa se o email ja existe, importante pra services
    boolean existsByEmail(String email);
}
