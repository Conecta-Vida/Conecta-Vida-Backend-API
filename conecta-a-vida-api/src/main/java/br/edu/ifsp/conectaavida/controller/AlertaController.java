package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    @GetMapping("/ativos")
    public ResponseEntity<List<Comunicacao>> listarAlertasAtivos() {
        List<Comunicacao> alertas = comunicacaoRepository.findByTipoAndLidoFalseOrderByDataPostadaDesc("ALERTA");
        return ResponseEntity.ok(alertas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAlerta(@PathVariable Long id, @RequestBody Comunicacao dadosNovos) {
        return comunicacaoRepository.findById(id)
                .map(alerta -> {
                    alerta.setTitulo(dadosNovos.getTitulo());
                    alerta.setDescricao(dadosNovos.getDescricao());
                    alerta.setCategoria(dadosNovos.getCategoria());
                    alerta.setLocalizacao(dadosNovos.getLocalizacao());

                    // 🟢 CORRIGIDO: Substituído isLido() por getLido() para casar com a convenção wrapper do Lombok
                    alerta.setLido(dadosNovos.getLido());

                    Comunicacao updated = comunicacaoRepository.save(alerta);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}