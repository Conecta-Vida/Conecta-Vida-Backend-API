package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.LogAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {

    // Limita o retorno para os 5 registos de atividade mais recentes
    List<LogAtividade> findTop5ByOrderByDataHoraDesc();
}