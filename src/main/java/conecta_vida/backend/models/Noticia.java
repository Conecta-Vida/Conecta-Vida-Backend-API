package  conecta_vida.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "noticias")
@Data
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(name = "linkimagem", nullable = false)
    private String linkImagem;

    @Column(nullable = false, length = 100)
    private String localizacao;

    @Column(name = "data_vencimento")
    private LocalDateTime dataVencimento;

    @Column(name = "data_evento")
    private LocalDateTime dataEvento;

    @Column(name = "data_postada")
    private LocalDateTime dataPostada;

    // N:1 pois muitas notícias podem pertencer a um orgao só
    @ManyToOne
    @JoinColumn(name = "orgao_id", nullable = false)
    private OrgaoSaude orgao;
}