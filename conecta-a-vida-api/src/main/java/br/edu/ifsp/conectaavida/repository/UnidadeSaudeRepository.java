package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.UnidadeSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadeSaudeRepository extends JpaRepository<UnidadeSaude, Long> {
}