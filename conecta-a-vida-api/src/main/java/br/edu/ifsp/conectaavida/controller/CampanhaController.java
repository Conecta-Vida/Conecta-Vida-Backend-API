package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.service.CampanhaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * CONTROLLER: CampanhaController
 * Rota Base: /api/campanhas
 */
@RestController
@RequestMapping("/api/campanhas")
@CrossOrigin(origins = "*")
public class CampanhaController {

    @Autowired private CampanhaService service;
    @Autowired private ComunicacaoRepository repository;

    @GetMapping
    public List<Comunicacao> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comunicacao> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .filter(c -> "CAMPANHA".equals(c.getTipo())) // Blindagem: impede vazamento de dados caso o ID seja de uma Notícia
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comunicacao> atualizar(@PathVariable Long id, @RequestBody Comunicacao dados) {
        return repository.findById(id)
                .filter(c -> "CAMPANHA".equals(c.getTipo()))
                .map(campanha -> {
                    campanha.setTitulo(dados.getTitulo());
                    campanha.setDescricao(dados.getDescricao());
                    campanha.setCategoria(dados.getCategoria());
                    campanha.setLinkimagem(dados.getLinkimagem());
                    campanha.setLocalizacao(dados.getLocalizacao());
                    campanha.setDataInicio(dados.getDataInicio());
                    campanha.setDataFim(dados.getDataFim());
                    campanha.setPublicoAlvo(dados.getPublicoAlvo());
                    campanha.setStatus(dados.getStatus());

                    return ResponseEntity.ok(service.salvar(campanha));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}