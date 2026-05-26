package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * CONTROLLER: AlertaController
 * Rota Base: /api/alertas
 */
@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired private ComunicacaoRepository repository;

    @GetMapping
    public List<Comunicacao> listar() {
        // Exibe apenas comunicados filtrados por ALERTA que ainda não foram marcados como resolvidos/lidos
        return repository.findByTipoAndLidoFalseOrderByDataPostadaDesc("ALERTA");
    }

    @PostMapping
    public Comunicacao criar(@RequestBody Comunicacao alerta) {
        alerta.setTipo("ALERTA"); // Força a classificação de negócio correta
        alerta.setLido(false);    // Nasce aberto para visualização imediata no app dos cidadãos
        return repository.save(alerta);
    }

    @PutMapping("/{id}/lido")
    public void marcarLido(@PathVariable Long id) {
        repository.findById(id).ifPresent(alerta -> {
            alerta.setLido(true); // Encerra a exibição ativa do alerta
            repository.save(alerta);
        });
    }
}