package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.UnidadeSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UnidadeSaudeRepository extends JpaRepository<UnidadeSaude, Long> {

    // Traz o primeiro registro que encontrar. Usado porque a Unidade de Saúde é uma configuração única.
    Optional<UnidadeSaude> findTopByOrderByIdAsc();
}