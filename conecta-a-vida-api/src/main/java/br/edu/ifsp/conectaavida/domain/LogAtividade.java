package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_atividade")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LogAtividade {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String usuario;
    @Column(nullable = false) private String acao;

    @CreationTimestamp private LocalDateTime dataHora;
}