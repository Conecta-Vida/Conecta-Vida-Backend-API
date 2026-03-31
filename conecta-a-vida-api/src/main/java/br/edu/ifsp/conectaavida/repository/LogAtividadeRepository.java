package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.LogAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {
    // Busca os 5 logs mais recentes
    List<LogAtividade> findTop5ByOrderByDataHoraDesc();
}