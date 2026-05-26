package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired private ComunicacaoRepository repository;

    @GetMapping
    public List<Comunicacao> listar() {
        return repository.findByTipoAndLidoFalseOrderByDataPostadaDesc("ALERTA");
    }

    // === ADICIONE ESTE MÉTODO ABAIXO ===
    @PostMapping
    public Comunicacao criar(@RequestBody Comunicacao alerta) {
        alerta.setTipo("ALERTA"); // Força o tipo correto de acordo com a sua tabela
        alerta.setLido(false);    // Garante que nasce ativo
        return repository.save(alerta);
    }

    @PutMapping("/{id}/lido")
    public void marcarLido(@PathVariable Long id) {
        repository.findById(id).ifPresent(alerta -> {
            alerta.setLido(true);
            repository.save(alerta);
        });
    }
}