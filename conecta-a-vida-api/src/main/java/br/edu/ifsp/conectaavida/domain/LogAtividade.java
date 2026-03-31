package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs_atividade")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogAtividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String usuario; // Nome de quem realizou a ação

    @Column(nullable = false)
    private String acao; // Ex: "Recebeu vacina Gripe"

    @Column(nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();
}