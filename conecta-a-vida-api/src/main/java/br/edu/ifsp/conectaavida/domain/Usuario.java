package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID atualizado para Long (bigint)

    @Column(nullable = false) private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false) private String senha;

    private Integer idade;
    private String sexo;
    private String localizacao;
}