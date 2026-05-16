package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity // Avisa ao Spring que esta classe representa uma tabela no banco de dados.
// @Table permite mudar o nome da tabela e criar índices. Aqui criamos um índice para buscas mais rápidas.
@Table(name = "alertas", indexes = {@Index(name = "idx_alerta_lido_data", columnList = "lido, dataCriacao")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Alerta {

    @Id // Marca o campo como Chave Primária.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // O banco gera o ID automaticamente (auto-incremento).
    private Long id;

    @Column(nullable = false) // 'nullable = false' impede que o valor seja nulo no banco (NOT NULL).
    private String tipo;

    @Column(nullable = false)
    private String titulo;

    // columnDefinition = "TEXT" força o banco a aceitar textos gigantes, ignorando o limite de 255 caracteres.
    @Column(columnDefinition = "TEXT")
    private String descricao;

    @CreationTimestamp // O Hibernate preenche a data e hora sozinho no momento do INSERT.
    private LocalDateTime dataCriacao;

    private boolean lido = false; // Valor padrão quando um alerta nasce.
}