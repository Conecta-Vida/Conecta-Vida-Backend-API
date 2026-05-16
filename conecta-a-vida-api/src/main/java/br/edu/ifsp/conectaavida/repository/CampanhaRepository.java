package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Campanha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampanhaRepository extends JpaRepository<Campanha, Long> {
    // Como não precisamos de buscas complexas, deixamos vazio e usamos os métodos padrão.
}