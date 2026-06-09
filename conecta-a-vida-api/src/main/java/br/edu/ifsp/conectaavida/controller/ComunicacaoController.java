package br.edu.ifsp.conectaavida.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;

/**
 * CONTROLLER: ComunicacaoController
 * Rota Base: /api/comunicacoes
 * Objetivo: Canal polimórfico unificado para persistência e deleção de Alertas e Campanhas.
 */
@RestController
@RequestMapping("/api/comunicacoes")
public class ComunicacaoController {

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    @PostMapping
    public ResponseEntity<?> cadastrarComunicacao(@RequestBody Comunicacao comunicacao) {
        try {
            // 🟢 CORRIGIDO DEFINITIVAMENTE:
            // Removemos o `.toString()` para entregar o objeto `LocalDateTime` puro.
            // Isso casa perfeitamente com a tipagem da entidade e resolve o erro "incompatible types".
            comunicacao.setDataPostada(LocalDateTime.now());

            Comunicacao salva = comunicacaoRepository.save(comunicacao);
            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getLocalizedMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarComunicacao(@PathVariable Long id) {
        if (!comunicacaoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        comunicacaoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Adicione isto no ComunicacaoController.java
    @GetMapping
    public ResponseEntity<List<Comunicacao>> listarTodas() {
        return ResponseEntity.ok(comunicacaoRepository.findAll());
    }
}