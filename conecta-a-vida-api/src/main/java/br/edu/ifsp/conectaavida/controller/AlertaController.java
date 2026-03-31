package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Alerta;
import br.edu.ifsp.conectaavida.repository.AlertaRepository; // Importação correta
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaRepository repository; // Mudado de CampanhaRepository.AlertaRepository para AlertaRepository

    @GetMapping
    public List<Alerta> listar() {
        return repository.findByLidoFalseOrderByDataCriacaoDesc();
    }

    @PutMapping("/{id}/lido")
    public void marcarLido(@PathVariable Long id) {
        Alerta alerta = repository.findById(id).orElseThrow();
        alerta.setLido(true);
        repository.save(alerta);
    }
}