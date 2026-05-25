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
    @Autowired private ComunicacaoRepository comunicacaoRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return new DashboardStatsDTO(
                usuarioRepository.count(),
                comunicacaoRepository.countByTipoAndLidoFalse("ALERTA")
        );
    }

    @GetMapping("/chart")
    public List<ChartDataDTO> getChartData() {
        return Collections.emptyList();
    }
}