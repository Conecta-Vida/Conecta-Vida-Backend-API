package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unidade_saude")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UnidadeSaude {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String telefone;
    private String email;

    @Column(name = "horario_seg_sex") private String horarioSegSex;
    @Column(name = "horario_sabado") private String horarioSabado;
    @Column(name = "horario_domingo") private String horarioDomingo;
}