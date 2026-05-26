package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTIDADE: Usuario
 * Tabela na Base de Dados: "usuarios"
 * Objetivo: Representar tanto os cidadãos comuns da plataforma quanto os administradores do painel.
 */
@Entity // Indica ao Spring Boot/Hibernate que esta classe é uma entidade gerida pelo banco de dados
@Table(name = "usuarios") // Define explicitamente o nome da tabela física no PostgreSQL
@Getter // Lombok: Cria automaticamente os métodos get de todos os atributos em tempo de compilação
@Setter // Lombok: Cria automaticamente os métodos set de todos os atributos em tempo de compilação
@NoArgsConstructor // Lombok: Cria o construtor padrão vazio (exigido pelo JPA)
@AllArgsConstructor // Lombok: Cria um construtor completo com todos os parâmetros da classe
public class Usuario {

    @Id // Define o atributo abaixo como a Chave Primária (Primary Key) da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura o ID como auto-incremental (Serial/Identity no Postgres)
    private Long id;

    @Column(nullable = false) // Garante que a coluna não aceita valores nulos (NOT NULL)
    private String nome;

    @Column(nullable = false, unique = true) // NOT NULL e impede a existência de dois utilizadores com o mesmo e-mail
    private String email;

    @Column(nullable = false) // NOT NULL: Armazena a credencial de acesso do utilizador
    private String senha;

    private Integer idade; // Tipo Integer (objeto) aceita nulo caso o utilizador não queira informar a idade

    private String sexo;

    /**
     * IMPORTANTE PARA A EQUIPA:
     * O atributo 'localizacao' armazena as permissões ou níveis de acesso do sistema.
     * Se o valor for "Administrador", o AuthController liberta o acesso para o painel em React.
     */
    private String localizacao;
}