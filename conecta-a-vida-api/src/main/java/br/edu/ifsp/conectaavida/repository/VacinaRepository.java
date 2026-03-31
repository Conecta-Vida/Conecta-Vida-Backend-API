package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Vacina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacinaRepository extends JpaRepository<Vacina, Long> {

    // Método customizado para buscar vacinas pelo nome (ignorando maiúsculas/minúsculas)
    List<Vacina> findByNomeContainingIgnoreCase(String nome);
}