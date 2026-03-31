package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.RegistroVacinacao;
import br.edu.ifsp.conectaavida.repository.RegistroVacinacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacinacao")
@CrossOrigin(origins = "*")
public class RegistroVacinacaoController {

    @Autowired
    private RegistroVacinacaoRepository vacinacaoRepository;

    @GetMapping("/paciente/{pacienteId}")
    public List<RegistroVacinacao> listarPorPaciente(@PathVariable Long pacienteId) {
        // Chamada corrigida para coincidir com o método do repositório
        return vacinacaoRepository.findByPaciente_Id(pacienteId);
    }

    @PostMapping
    public RegistroVacinacao registrar(@RequestBody RegistroVacinacao registro) {
        return vacinacaoRepository.save(registro);
    }
}