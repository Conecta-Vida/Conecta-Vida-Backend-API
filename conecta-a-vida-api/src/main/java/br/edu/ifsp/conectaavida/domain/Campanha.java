package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "campanhas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Campanha {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String titulo;
    @Column(columnDefinition = "TEXT") private String descricao;

    // @Column(name="...") diz que no Java a variável chama 'dataInicio', mas no banco a coluna chama 'data_inicio'.
    @Column(name = "data_inicio", nullable = false) private LocalDate dataInicio;
    @Column(name = "data_fim", nullable = false) private LocalDate dataFim;
    @Column(name = "publico_alvo") private String publicoAlvo;
    @Column(nullable = false) private String status;
}