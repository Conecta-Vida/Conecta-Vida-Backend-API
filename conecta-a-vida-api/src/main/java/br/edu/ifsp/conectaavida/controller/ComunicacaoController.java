package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.service.ComunicacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ComunicacaoController {

    @Autowired
    private ComunicacaoService comunicacaoService;

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    /**
     * ROTAS GÊMEAS (CONCEITO DE COMPATIBILIDADE DE ROTAS):
     * Explicação para o grupo: Mapeamos o mesmo método Java para escutar dois caminhos diferentes.
     * Assim, se o Painel Web chamar "/api/comunicacoes" ou se o Aplicativo Mobile antigo chamar
     * "/api/noticias", o Java recebe ambos sem quebrar nenhuma das duas interfaces e salva centralizado!
     */
    @PostMapping({"/api/comunicacoes", "/api/noticias"})
    public ResponseEntity<?> criarPublicacao(@RequestBody Comunicacao comunicacao) {
        try {
            Comunicacao salva = comunicacaoService.cadastrarPublicacao(comunicacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", e.getMessage()));
        }
    }

    // LISTAGEM GERAL GÊMEA (WEB ADMIN & MOBILE)
    @GetMapping({"/api/comunicacoes", "/api/noticias"})
    public ResponseEntity<List<Comunicacao>> listarTodas() {
        return ResponseEntity.ok(comunicacaoRepository.findAll());
    }

    // FILTRO FILTRADO (MOBILE): Separa dinamicamente por tipo textual ('NOTICIA', 'CAMPANHA', 'ALERTA')
    @GetMapping("/api/comunicacoes/tipo/{tipo}")
    public ResponseEntity<List<Comunicacao>> listarPorTipo(@PathVariable String tipo) {
        return ResponseEntity.ok(comunicacaoRepository.findByTipo(tipo.toUpperCase()));
    }

    // FILTRO FILTRADO (MOBILE): Responde às buscas por categoria (Ex: Tema 'Epidemia', Tema 'Vacina')
    @GetMapping({"/api/comunicacoes/tema/{categoria}", "/api/noticias/tema/{categoria}"})
    public ResponseEntity<List<Comunicacao>> listarPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(comunicacaoRepository.findByTipoAndCategoria("NOTICIA", categoria));
    }

    // REMOÇÃO DE REGISTROS (CRUD - DELETE)
    @DeleteMapping("/api/comunicacoes/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        if (!comunicacaoRepository.existsById(id)) return ResponseEntity.notFound().build();
        comunicacaoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}