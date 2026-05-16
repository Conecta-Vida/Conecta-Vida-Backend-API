package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
// ATENÇÃO: Segundo parâmetro é Integer porque o ID de Usuário é Integer.
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Busca customizada para validação de login ou checagem.
    Optional<Usuario> findByEmail(String email);
}