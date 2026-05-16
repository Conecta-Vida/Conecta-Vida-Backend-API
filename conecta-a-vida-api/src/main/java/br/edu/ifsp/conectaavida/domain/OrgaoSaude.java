package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orgaos_saude")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrgaoSaude {

    // ATENÇÃO EQUIPE: ID como Integer por causa da tabela existente no Supabase.
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false) private String nome;
    private String telefone;
    private String linksite;
}