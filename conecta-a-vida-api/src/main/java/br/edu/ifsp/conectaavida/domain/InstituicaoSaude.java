package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instituicoes_saude")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InstituicaoSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipo_instituicao", nullable = false)
    private String tipoInstituicao; // 'ORGAO' ou 'UNIDADE'

    @Column(nullable = false) private String nome;

    private String email;
    private String telefone;
    private String linksite;
    private String endereco;

    @Column(name = "horario_seg_sex") private String horarioSegSex;
    @Column(name = "horario_sabado") private String horarioSabado;
    @Column(name = "horario_domingo") private String horarioDomingo;
}