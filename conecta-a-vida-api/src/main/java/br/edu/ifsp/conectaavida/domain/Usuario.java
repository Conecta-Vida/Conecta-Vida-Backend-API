package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Usuario {

    // ATENÇÃO EQUIPE: ID como Integer por causa da tabela existente no Supabase.
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String nome;

    // unique = true avisa ao banco para não aceitar dois usuários com o mesmo e-mail.
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String senha;

    private Integer idade;
    private String sexo;
    private String localizacao;
}