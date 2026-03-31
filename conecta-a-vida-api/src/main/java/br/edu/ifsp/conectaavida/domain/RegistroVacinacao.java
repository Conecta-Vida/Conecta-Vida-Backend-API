package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "registros_vacinacao")
public class RegistroVacinacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeVacina;

    @Column(nullable = false)
    private LocalDate dataAplicacao;

    @Column(nullable = false)
    private String lote;

    private String profissionalSaude;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "vacina_id", nullable = false)
    private Vacina vacina;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeVacina() { return nomeVacina; }
    public void setNomeVacina(String nomeVacina) { this.nomeVacina = nomeVacina; }
    public LocalDate getDataAplicacao() { return dataAplicacao; }
    public void setDataAplicacao(LocalDate dataAplicacao) { this.dataAplicacao = dataAplicacao; }
    public String getLote() { return lote; }
    public void setLote(String lote) { this.lote = lote; }
    public String getProfissionalSaude() { return profissionalSaude; }
    public void setProfissionalSaude(String profissionalSaude) { this.profissionalSaude = profissionalSaude; }
    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }
    public Vacina getVacina() { return vacina; }
    public void setVacina(Vacina vacina) { this.vacina = vacina; }
}