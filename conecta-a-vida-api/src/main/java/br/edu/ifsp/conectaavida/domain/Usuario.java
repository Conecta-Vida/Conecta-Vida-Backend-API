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
    private String senha; // Armazena a senha criptografada em SHA-256

    private Integer idade;
    private String sexo;

    /**
     * LOCALIZAÇÃO GEOGRÁFICA (MANTIDO EXCLUSIVO DO MOBILE)
     * Usado pelo app do smartphone para filtrar o Feed de notícias e alertas regionais.
     * Exemplos: "Zona Norte", "Centro", "Lavapés", "Zona Rural".
     */
    @Column(name = "localizacao")
    private String localizacao;

    /**
     * NÍVEL DE PERMISSÃO / PAPEL NO SISTEMA (ADICIONADO PARA SEGURANÇA WEB)
     * Determina se a conta possui acesso liberado às telas de gestão do painel corporativo.
     * - "Administrador": Gestor com acesso completo.
     * - "Usuário Comum": Cidadão comum do aplicativo móvel.
     */
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