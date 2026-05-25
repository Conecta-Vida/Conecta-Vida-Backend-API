package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComunicacaoRepository extends JpaRepository<Comunicacao, Long> {

    // Procura por tipo (ex: devolve apenas as que são 'NOTICIA')
    List<Comunicacao> findByTipo(String tipo);

    // Procura alertas que ainda não foram lidos, ordenando pelos mais recentes
    List<Comunicacao> findByTipoAndLidoFalseOrderByDataPostadaDesc(String tipo);

    // Conta quantos registos ativos existem de um determinado tipo (usado no Dashboard)
    long countByTipoAndLidoFalse(String tipo);
}