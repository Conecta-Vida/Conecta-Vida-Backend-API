package conecta_vida.backend.repository;

import conecta_vida.backend.models.OrgaoSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrgaoSaudeRepository extends JpaRepository<OrgaoSaude, Integer> {
    // JpaRepository já nos dá os CRUD basicos como encontrar por id, deletar, criar, etc.)
}