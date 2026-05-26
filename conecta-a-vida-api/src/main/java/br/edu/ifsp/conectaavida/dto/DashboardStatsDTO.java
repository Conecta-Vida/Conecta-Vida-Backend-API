package br.edu.ifsp.conectaavida.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsuarios;
    private long alertasAtivos;
    // === ADICIONE ESTAS DUAS LINHAS ABAIXO ===
    private long campanhasAtivas;
    private long noticiasPublicadas;
}