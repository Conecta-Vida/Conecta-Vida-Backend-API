package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * INTERFACE: UsuarioRepository
 * Objetivo: Operar buscas e cadastros na tabela de usuários e administradores ("usuarios").
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Procura um usuário através de uma correspondência exata de e-mail.
     * * Explicação para a Equipa: Como a coluna 'email' possui a restrição UNIQUE no banco do Supabase,
     * esta consulta é extremamente rápida e assertiva. É o método chave utilizado pelo processo de
     * login para encontrar o usuário antes de validar se a senha informada está correta.
     */
    Optional<Usuario> findByEmail(String email);
}