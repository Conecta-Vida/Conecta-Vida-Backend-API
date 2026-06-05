package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.InstituicaoSaude;
import br.edu.ifsp.conectaavida.repository.InstituicaoSaudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER: InstituicaoSaudeController
 * 🟢 CORRIGIDO: Ajustado o nome da classe para coincidir exatamente com o nome do arquivo físico.
 */
@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoSaudeController {

    @Autowired
    private InstituicaoSaudeRepository repository;

    @GetMapping
    public ResponseEntity<List<InstituicaoSaude>> listarTodas() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<InstituicaoSaude> cadastrar(@RequestBody InstituicaoSaude instituicao) {
        InstituicaoSaude salva = repository.save(instituicao);
        return ResponseEntity.ok(salva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody InstituicaoSaude dadosNovos) {
        return repository.findById(id)
                .map(inst -> {
                    inst.setNome(dadosNovos.getNome());
                    inst.setTipoInstituicao(dadosNovos.getTipoInstituicao());
                    inst.setTelefone(dadosNovos.getTelefone());
                    inst.setEmail(dadosNovos.getEmail());
                    inst.setEndereco(dadosNovos.getEndereco());
                    inst.setLinksite(dadosNovos.getLinksite());
                    inst.setHorarioSegSex(dadosNovos.getHorarioSegSex());
                    inst.setHorarioSabado(dadosNovos.getHorarioSabado());
                    inst.setHorarioDomingo(dadosNovos.getHorarioDomingo());
                    InstituicaoSaude atualizada = repository.save(inst);
                    return ResponseEntity.ok(atualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}