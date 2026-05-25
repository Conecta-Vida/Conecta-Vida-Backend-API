package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.LogAtividade;
import br.edu.ifsp.conectaavida.repository.LogAtividadeRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogAtividadeController {

    private final LogAtividadeRepository repository;

    public LogAtividadeController(LogAtividadeRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/recentes")
    public List<LogAtividade> listarRecentes() {
        return repository.findTop5ByOrderByDataHoraDesc();
    }
}