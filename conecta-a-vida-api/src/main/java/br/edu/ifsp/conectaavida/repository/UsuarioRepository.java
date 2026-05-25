package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Utilizado para procurar utilizadores pelo e-mail (Login/Validações)
    Optional<Usuario> findByEmail(String email);
}