package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vacinas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vacina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "intervalo_doses_dias")
    private Integer intervaloDosesDias; // Dias de intervalo entre as doses (se houver)
}