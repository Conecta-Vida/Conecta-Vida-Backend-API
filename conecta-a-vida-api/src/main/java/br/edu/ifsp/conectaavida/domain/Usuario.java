package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios", schema = "public")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "data_nascimento")
    private Integer dataNascimento;

    private String sexo;

    @Column(name = "localizacao")
    private String localizacao;

    @Column(name = "permissao", nullable = false)
    private String permissao;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuarios_campanhas",
            schema = "public",
            joinColumns = @JoinColumn(name = "usuario_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "comunicacao_id", referencedColumnName = "id")
    )
    private Set<Comunicacao> campanhasInscritas = new HashSet<>();
}
