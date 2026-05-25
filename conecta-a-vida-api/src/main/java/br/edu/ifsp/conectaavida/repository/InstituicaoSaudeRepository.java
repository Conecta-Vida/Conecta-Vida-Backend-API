package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.InstituicaoSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InstituicaoSaudeRepository extends JpaRepository<InstituicaoSaude, Long> {

    // Procura a primeira instituição de um determinado tipo (ex: 'UNIDADE')
    Optional<InstituicaoSaude> findTopByTipoInstituicaoOrderByIdAsc(String tipoInstituicao);
}