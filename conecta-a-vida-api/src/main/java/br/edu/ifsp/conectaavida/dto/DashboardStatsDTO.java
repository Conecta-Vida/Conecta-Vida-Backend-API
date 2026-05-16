package br.edu.ifsp.conectaavida.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsuarios; // Mudou de totalPacientes para totalUsuarios
    private long vacinasAplicadas; // Deixaremos aqui temporariamente com valor 0 para não quebrar o seu Frontend
    private long alertasAtivos;
    private long agendamentosHoje;
}