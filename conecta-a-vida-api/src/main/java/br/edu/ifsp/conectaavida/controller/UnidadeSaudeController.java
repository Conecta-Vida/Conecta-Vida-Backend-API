package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.UnidadeSaude;
import br.edu.ifsp.conectaavida.repository.UnidadeSaudeRepository; // Importação que estava faltando
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/unidade-saude")
@CrossOrigin(origins = "*")
public class UnidadeSaudeController {

    @Autowired
    private UnidadeSaudeRepository repository;

    @GetMapping
    public UnidadeSaude obter() {
        // Retorna a primeira configuração encontrada ou uma nova vazia
        return repository.findAll().stream().findFirst().orElse(new UnidadeSaude());
    }

    @PostMapping
    public UnidadeSaude salvar(@RequestBody UnidadeSaude dados) {
        // Lógica para manter sempre apenas um registro (configuração única da UBS)
        repository.findAll().stream().findFirst().ifPresent(u -> dados.setId(u.getId()));
        return repository.save(dados);
    }
}