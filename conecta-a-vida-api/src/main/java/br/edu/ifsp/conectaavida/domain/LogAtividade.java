package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * ENTIDADE: LogAtividade
 * Tabela na Base de Dados: "logs_atividade"
 * Objetivo: Registar ações administrativas (auditoria) para sabermos quem executou cada tarefa.
 */
@Entity
@Table(name = "logs_atividade")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LogAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * RELACIONAMENTO MUITOS-PARA-UM (Muitos logs pertencem a um único Usuário)
     * * Otimização Didática (FetchType.LAZY): Explique aos seus colegas que isto evita o "problema do SELECT N+1".
     * O Hibernate só irá buscar os dados completos do Usuário no banco se o método getUsuario() for explicitamente chamado.
     * Isto poupa memória e acelera as consultas ao Supabase.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false) // Chave Estrangeira (Foreign Key) mapeada no banco
    private Usuario usuario;

    @Column(nullable = false)
    private String acao; // Descrição textual da atividade realizada (Ex: "Importou lista CSV de usuários")

    @CreationTimestamp // Anotação do Hibernate que captura e insere a data/hora atual do servidor de forma automática no INSERT
    @Column(name = "data_hora", updatable = false) // updatable = false garante que a data do registo nunca será modificada por um UPDATE
    private LocalDateTime dataHora;
}