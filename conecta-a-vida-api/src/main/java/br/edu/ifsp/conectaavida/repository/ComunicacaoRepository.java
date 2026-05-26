package br.edu.ifsp.conectaavida.repository;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * INTERFACE: ComunicacaoRepository
 * Objetivo: Realizar operações de CRUD e buscas customizadas na tabela "comunicacoes".
 * * Explicação para a Equipa: Ao estender JpaRepository<Comunicacao, Long>, herdamos
 * dezenas de métodos prontos, como .save(), .findAll(), .deleteById() e .count().
 */
@Repository // Indica ao Spring que esta classe gerencia transações de persistência com o banco
public interface ComunicacaoRepository extends JpaRepository<Comunicacao, Long> {

    /**
     * Busca genérica por tipo.
     * Exemplo: Se passarmos "NOTICIA", trará todas as linhas que possuem esse tipo no banco.
     */
    List<Comunicacao> findByTipo(String tipo);

    /**
     * Query Method Avançado: O Spring decifra o nome deste método e monta um SQL com:
     * WHERE tipo = ? AND lido = false ORDER BY data_postada DESC;
     * Muito utilizado para listar os Alertas mais urgentes e recentes no aplicativo dos cidadãos.
     */
    List<Comunicacao> findByTipoAndLidoFalseOrderByDataPostadaDesc(String tipo);

    /**
     * Conta registros específicos não lidos.
     * Usado no Dashboard para exibir a quantidade de Alertas Críticos pendentes de atenção.
     */
    long countByTipoAndLidoFalse(String tipo);

    /**
     * Conta o total absoluto de registros filtrados apenas por tipo.
     * Usado no Dashboard para sabermos quantas Notícias já foram publicadas de forma vitalícia.
     */
    long countByTipo(String tipo);

    /**
     * Conta cruzando duas colunas: tipo e status.
     * Usado no Dashboard para retornar o número exato de Campanhas de Saúde cujo status seja textualmente "Ativa".
     */
    long countByTipoAndStatus(String tipo, String status);
}