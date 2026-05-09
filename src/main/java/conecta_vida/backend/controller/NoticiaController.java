package conecta_vida.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conecta_vida.backend.models.Noticia;
import conecta_vida.backend.repository.NoticiaRepository;
import conecta_vida.backend.services.NoticiaService;



@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {
    
    @Autowired
    private NoticiaService noticiaService;

    @Autowired
    private NoticiaRepository noticiaRepository;

    @PostMapping
    public ResponseEntity<?> publicarNoticia(@RequestBody Noticia noticia) {
        try {
            Noticia noticiaSalva = noticiaService.cadastrarNoticia(noticia);
            return ResponseEntity.status(HttpStatus.CREATED).body(noticiaSalva);
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Noticia>> listarTodasNoticias(){
        return ResponseEntity.ok(noticiaRepository.findAll());
    }

    //listar por categoria
    @GetMapping("/tema/{categoria}")
    public ResponseEntity<List<Noticia>> listarPorCategoria(@PathVariable String categoria){
        return ResponseEntity.ok(noticiaRepository.findByCategoria(categoria));
    }
    
    

}
