package br.edu.ifsp.conectaavida.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @Column(nullable = false)
    private String senha; // Armazenará a senha em formato HASH (Criptografada)

    @Column(name = "data_nascimento")
    private Integer dataNascimento; // Armazena o ano de nascimento (Ex: 2004)

    private String sexo;

    /**
     * CAMPO LOCALIZAÇÃO (METADADO DE PERMISSÃO):
     * Usado estrategicamente para definir o papel do usuário no sistema:
     * - "Administrador": Tem acesso total às telas de gestão do Painel Web.
     * - "Usuário Comum": Cidadão comum que acessa apenas o aplicativo mobile.
     */
    private String localizacao;

    @Column(nullable = false)
    private String permissao; // Nível de acesso real

    /**
     * REQUISITO CR7: RELACIONAMENTO MUITOS-PARA-MUITOS
     */
    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuarios_campanhas",
            schema = "public",
            joinColumns = @JoinColumn(name = "usuario_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "comunicacao_id", referencedColumnName = "id")
    )
    private Set<Comunicacao> campanhasInscritas = new HashSet<>();
}