package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.dto.ChartDataDTO;
import br.edu.ifsp.conectaavida.dto.DashboardStatsDTO;
import br.edu.ifsp.conectaavida.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private RegistroVacinacaoRepository vacinacaoRepository;

    @Autowired
    private AlertaRepository alertaRepository;

    // ESTA ROTA ESTAVA A FALTAR E É A QUE PREENCHE OS CARDS
    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        long pacientes = pacienteRepository.count();
        long vacinas = vacinacaoRepository.count();
        long alertas = alertaRepository.countByLidoFalse();
        // O valor 42 é apenas um exemplo para agendamentos
        return new DashboardStatsDTO(pacientes, vacinas, alertas, 42);
    }

    @GetMapping("/chart")
    public List<ChartDataDTO> getChartData() {
        return vacinacaoRepository.findVacinacaoMensalRaw().stream()
                .map(obj -> new ChartDataDTO((String) obj[0], ((Number) obj[1]).longValue()))
                .collect(Collectors.toList());
    }
}