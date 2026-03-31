package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByLidoFalseOrderByDataCriacaoDesc();
    long countByLidoFalse();
}