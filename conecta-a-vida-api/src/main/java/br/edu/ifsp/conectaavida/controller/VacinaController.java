package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Vacina;
import br.edu.ifsp.conectaavida.service.VacinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vacinas")
@CrossOrigin(origins = "*") // Permite que o seu React (Vite) consuma essa API
public class VacinaController {

    @Autowired
    private VacinaService vacinaService;

    @GetMapping
    public List<Vacina> listar() {
        return vacinaService.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vacina> buscar(@PathVariable Long id) {
        Optional<Vacina> vacina = vacinaService.buscarPorId(id);
        return vacina.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vacina cadastrar(@RequestBody Vacina vacina) {
        return vacinaService.salvar(vacina);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        vacinaService.deletar(id);
    }
}