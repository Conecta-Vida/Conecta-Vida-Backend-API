package conecta_vida.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "orgaos_saude")
@Data //gera os getters e setters automaticamente
public class OrgaoSaude {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 20)
    private String telefone;

    @Column(name = "linksite")
    private String linkSite;
}

/* 
CREATE TABLE orgaos_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    linkSite VARCHAR(255)
);
*/
