package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.RegistroVacinacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegistroVacinacaoRepository extends JpaRepository<RegistroVacinacao, Long> {

    @Query(value = "SELECT TO_CHAR(data_aplicacao, 'Mon') as mes, COUNT(*) as quantidade " +
            "FROM registros_vacinacao " + // ADICIONAR O 's' AQUI
            "GROUP BY TO_CHAR(data_aplicacao, 'Mon'), EXTRACT(MONTH FROM data_aplicacao) " +
            "ORDER BY EXTRACT(MONTH FROM data_aplicacao)", nativeQuery = true)
    List<Object[]> findVacinacaoMensalRaw();

    // CORREÇÃO: Use o sublinhado (_) para indicar que o ID está dentro do objeto paciente
    List<RegistroVacinacao> findByPaciente_Id(Long pacienteId);
}