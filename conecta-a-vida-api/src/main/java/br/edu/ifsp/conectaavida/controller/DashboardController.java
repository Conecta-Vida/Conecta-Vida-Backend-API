package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.dto.*;
import br.edu.ifsp.conectaavida.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private AlertaRepository alertaRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        // Retorna DTOs populados com o total das tabelas usando '.count()'
        return new DashboardStatsDTO(usuarioRepository.count(), alertaRepository.countByLidoFalse());
    }

    @GetMapping("/chart")
    public List<ChartDataDTO> getChartData() {
        // Retorna vazio temporariamente para não quebrar o layout do Frontend.
        return Collections.emptyList();
    }
}