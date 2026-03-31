package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity // Diz ao Spring que esta classe é uma tabela no banco de dados
@Table(name = "pacientes") // Nome da tabela no PostgreSQL
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "tipagem_sanguinea", length = 3)
    private String tipagemSanguinea; // Ex: A+, O-, AB+
}