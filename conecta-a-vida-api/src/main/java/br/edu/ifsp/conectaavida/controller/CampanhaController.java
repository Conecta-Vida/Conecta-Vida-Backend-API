package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.service.CampanhaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campanhas")
@CrossOrigin(origins = "*") // Permite a comunicação direta com o teu Frontend em React
public class CampanhaController {

    @Autowired
    private CampanhaService service;

    @Autowired
    private ComunicacaoRepository repository;

    // 1. LISTAR TODAS AS CAMPANHAS
    @GetMapping
    public List<Comunicacao> listar() {
        return service.listarTodas();
    }

    // 2. BUSCAR UMA CAMPANHA ESPECÍFICA PELO ID
    @GetMapping("/{id}")
    public ResponseEntity<Comunicacao> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .filter(c -> "CAMPANHA".equals(c.getTipo())) // Garante que só retorna se for do tipo CAMPANHA
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. CRIAR UMA NOVA CAMPANHA
    @PostMapping
    public Comunicacao criar(@RequestBody Comunicacao campanha) {
        return service.salvar(campanha);
    }

    // 4. ATUALIZAR/EDITAR UMA CAMPANHA EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<Comunicacao> atualizar(@PathVariable Long id, @RequestBody Comunicacao dados) {
        return repository.findById(id)
                .filter(c -> "CAMPANHA".equals(c.getTipo())) // Proteção para editar apenas campanhas
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

                    // Salva usando o service para garantir que o tipo continue "CAMPANHA"
                    Comunicacao campanhaAtualizada = service.salvar(campanha);
                    return ResponseEntity.ok(campanhaAtualizada);
                }).orElse(ResponseEntity.notFound().build());
    }

    // 5. ELIMINAR UMA CAMPANHA PELO ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}