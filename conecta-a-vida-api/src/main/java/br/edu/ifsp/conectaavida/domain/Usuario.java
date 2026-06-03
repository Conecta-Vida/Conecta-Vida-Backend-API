package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

/**
 * ENTIDADE UNIFICADA: USUÁRIO
 * Esta classe atende tanto o cidadão do aplicativo mobile quanto o gestor do painel Web.
 * Ela centraliza os dados cadastrais e gerencia o nível de acesso do ecossistema.
 */
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
    private String senha; // Armazenará a senha em formato HASH (Criptografada)

    private Integer idade;
    private String sexo;

    /**
     * CAMPO LOCALIZAÇÃO (METADADO DE PERMISSÃO):
     * Usado estrategicamente para definir o papel do usuário no sistema:
     * - "Administrador": Tem acesso total às telas de gestão do Painel Web.
     * - "Usuário Comum": Cidadão comum que acessa apenas o aplicativo mobile.
     */
    private String localizacao; // deixei o comentario original do seu amigo ai em cima, mas agora isso aqui vai guardar a cidade de vdd msm

    @Column(nullable = false)
    private String permissao; // aqui a gente guarda o nivel de acesso real

    /**
     * REQUISITO CR7: RELACIONAMENTO MUITOS-PARA-MUITOS
     * Explicação para o grupo: Um Usuário (Cidadão) pode se inscrever em várias Campanhas de Saúde,
     * e uma Campanha de Saúde pode ter vários Usuários inscritos.
     * * O Hibernate gerencia isso criando automaticamente a tabela associativa física "usuarios_campanhas"
     * no banco de dados, vinculando a chave estrangeira "usuario_id" com "comunicacao_id".
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "usuarios_campanhas",
            schema = "public",
            joinColumns = @JoinColumn(name = "usuario_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "comunicacao_id", referencedColumnName = "id")
    )
    private Set<Comunicacao> campanhasInscritas = new HashSet<>();
}