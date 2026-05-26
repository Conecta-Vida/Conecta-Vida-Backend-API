package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComunicacaoRepository extends JpaRepository<Comunicacao, Long> {

    List<Comunicacao> findByTipo(String tipo);

    List<Comunicacao> findByTipoAndLidoFalseOrderByDataPostadaDesc(String tipo);

    long countByTipoAndLidoFalse(String tipo);

    // === ADICIONE ESTAS DUAS LINHAS ABAIXO ===
    long countByTipo(String tipo); // Usado para contar todas as notícias
    long countByTipoAndStatus(String tipo, String status); // Usado para contar campanhas com status 'Ativa'
}