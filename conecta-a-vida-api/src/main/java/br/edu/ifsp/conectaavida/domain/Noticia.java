package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "noticias")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Noticia {

    // ATENÇÃO EQUIPE: ID como Integer pois no Supabase a coluna é do tipo 'serial' (32 bits).
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String titulo;
    @Column(nullable = false, columnDefinition = "TEXT") private String conteudo;
    @Column(nullable = false) private String categoria;
    @Column(nullable = false) private String linkimagem;
    @Column(nullable = false) private String localizacao;

    private LocalDateTime dataVencimento;
    private LocalDateTime dataEvento;

    @CreationTimestamp private LocalDateTime dataPostada;

    // @ManyToOne indica um relacionamento. VÁRIAS notícias pertencem a UM órgão de saúde (Chave Estrangeira).
    @ManyToOne
    @JoinColumn(name = "orgao_id", nullable = false)
    private OrgaoSaude orgao;
}