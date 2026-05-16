package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Alerta;
import br.edu.ifsp.conectaavida.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Diz que a classe responde chamadas web com JSON.
@RequestMapping("/api/alertas") // A URL base para todas as rotas abaixo.
@CrossOrigin(origins = "*") // Resolve erros de CORS permitindo que o React consuma a API livremente.
public class AlertaController {

    @Autowired private AlertaRepository repository;

    @GetMapping // Acessado com um GET em /api/alertas
    public List<Alerta> listar() { return repository.findByLidoFalseOrderByDataCriacaoDesc(); }

    @PutMapping("/{id}/lido") // @PathVariable pega o '{id}' da URL.
    public void marcarLido(@PathVariable Long id) {
        // ifPresent evita erro caso o alerta não exista.
        repository.findById(id).ifPresent(alerta -> {
            alerta.setLido(true);
            repository.save(alerta);
        });
    }
}