package br.edu.ifsp.conectaavida.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    // Este DTO agrupa as estatísticas que aparecem nos "cards" principais do painel.
    private long totalUsuarios;
    private long alertasAtivos;
}