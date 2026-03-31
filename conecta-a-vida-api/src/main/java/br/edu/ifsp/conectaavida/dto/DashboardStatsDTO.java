package br.edu.ifsp.conectaavida.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalPacientes;
    private long vacinasAplicadas;
    private long alertasAtivos;
    private long agendamentosHoje;
}