package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.dto.ChartDataDTO;
import br.edu.ifsp.conectaavida.dto.DashboardStatsDTO;
import br.edu.ifsp.conectaavida.repository.AlertaRepository;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AlertaRepository alertaRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        long usuarios = usuarioRepository.count();
        long alertas = alertaRepository.countByLidoFalse();

        // Passamos 0 para as vacinas já que a funcionalidade foi removida
        return new DashboardStatsDTO(usuarios, 0, alertas, 42);
    }

    @GetMapping("/chart")
    public List<ChartDataDTO> getChartData() {
        // Como o gráfico era baseado em vacinas, retornaremos uma lista vazia por enquanto
        // para que a sua página de Dashboard não quebre no Frontend (React/Vite).
        return Collections.emptyList();
    }
}