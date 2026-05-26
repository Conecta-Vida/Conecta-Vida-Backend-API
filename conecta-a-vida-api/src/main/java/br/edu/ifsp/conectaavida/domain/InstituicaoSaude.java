package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

/**
 * ENTIDADE: InstituicaoSaude
 * Tabela na Base de Dados: "instituicoes_saude"
 * Objetivo: Mapear hospitais, UBSs, UPAs e postos de atendimento público.
 */
@Entity // Diz ao Hibernate que esta classe representa uma tabela do banco de dados
@Table(name = "instituicoes_saude") // Vincula a classe à tabela real no Supabase
@Getter // Cria automaticamente todos os métodos get em tempo de compilação
@Setter // Cria automaticamente todos os métodos set em tempo de compilação
@NoArgsConstructor // Construtor padrão sem argumentos (obrigatório para o JPA)
@AllArgsConstructor // Construtor completo com todos os atributos da classe
public class InstituicaoSaude {

    @Id // Define a Chave Primária da tabela
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Configura o ID como auto-incremental
    private Long id;

    // Conecta o atributo do Java com o nome da coluna em snake_case no PostgreSQL
    @Column(name = "tipo_instituicao", nullable = false)
    private String tipoInstituicao; // Aceita strings padronizadas como 'UNIDADE' ou 'UPA'

    @Column(nullable = false) // Campo obrigatório (NOT NULL)
    private String nome;

    private String email;
    private String telefone;
    private String linksite;
    private String endereco;

    // Mapeamento dos cronogramas semanais de atendimento da unidade
    @Column(name = "horario_seg_sex")
    private String horarioSegSex;

    @Column(name = "horario_sabado")
    private String horarioSabado;

    @Column(name = "horario_domingo")
    private String horarioDomingo;
}