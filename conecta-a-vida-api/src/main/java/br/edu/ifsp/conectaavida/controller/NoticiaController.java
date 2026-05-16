package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Noticia;
import br.edu.ifsp.conectaavida.repository.NoticiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "*")
public class NoticiaController {

    @Autowired private NoticiaRepository repository;

    @GetMapping
    public List<Noticia> listarTodas() { return repository.findAll(); }

    // ATENÇÃO EQUIPE: ID na URL deve ser Integer. Retorna 200 (OK) se achar, ou 404 (Not Found) se não achar.
    @GetMapping("/{id}")
    public ResponseEntity<Noticia> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Noticia criar(@RequestBody Noticia noticia) { return repository.save(noticia); }

    @PutMapping("/{id}")
    public ResponseEntity<Noticia> atualizar(@PathVariable Integer id, @RequestBody Noticia dados) {
        return repository.findById(id).map(noticia -> {
            noticia.setTitulo(dados.getTitulo());
            noticia.setConteudo(dados.getConteudo());
            noticia.setCategoria(dados.getCategoria());
            noticia.setLinkimagem(dados.getLinkimagem());
            noticia.setLocalizacao(dados.getLocalizacao());
            noticia.setDataVencimento(dados.getDataVencimento());
            noticia.setDataEvento(dados.getDataEvento());
            return ResponseEntity.ok(repository.save(noticia));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}