package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Marca como um componente de acesso a dados.
public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    // O Spring lê esse nome gigante e traduz para SQL:
    // SELECT * FROM alertas WHERE lido = false ORDER BY dataCriacao DESC
    List<Alerta> findByLidoFalseOrderByDataCriacaoDesc();

    // Traduz para: SELECT COUNT(*) FROM alertas WHERE lido = false
    long countByLidoFalse();
}