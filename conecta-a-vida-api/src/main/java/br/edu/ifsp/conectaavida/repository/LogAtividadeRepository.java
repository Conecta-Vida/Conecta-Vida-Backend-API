package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.LogAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogAtividadeRepository extends JpaRepository<LogAtividade, Long> {

    // O "Top5" já faz o papel do comando LIMIT 5 no SQL.
    List<LogAtividade> findTop5ByOrderByDataHoraDesc();
}