package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Campanha;
import br.edu.ifsp.conectaavida.service.CampanhaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campanhas")
@CrossOrigin(origins = "*")
public class CampanhaController {

    @Autowired
    private CampanhaService service;

    @GetMapping
    public List<Campanha> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Campanha criar(@RequestBody Campanha campanha) {
        return service.salvar(campanha);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}