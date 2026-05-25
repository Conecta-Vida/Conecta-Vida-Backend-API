package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comunicacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Comunicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo; // 'NOTICIA', 'CAMPANHA' ou 'ALERTA'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id")
    private InstituicaoSaude instituicao;

    @Column(nullable = false) private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    private String categoria;
    private String linkimagem;
    private String localizacao;

    @Column(name = "publico_alvo") private String publicoAlvo;

    private String status;
    private Boolean lido = false;

    @CreationTimestamp
    @Column(name = "data_postada", updatable = false)
    private LocalDateTime dataPostada;

    @Column(name = "data_inicio") private LocalDateTime dataInicio;
    @Column(name = "data_fim") private LocalDateTime dataFim;
}