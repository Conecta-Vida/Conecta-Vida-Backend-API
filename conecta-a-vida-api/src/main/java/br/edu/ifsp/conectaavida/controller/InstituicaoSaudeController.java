package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.InstituicaoSaude;
import br.edu.ifsp.conectaavida.repository.InstituicaoSaudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
@CrossOrigin(origins = "*")
public class InstituicaoSaudeController {

    @Autowired
    private InstituicaoSaudeRepository repository;

    // LISTAR TODAS AS INSTITUIÇÕES
    @GetMapping
    public List<InstituicaoSaude> listarTodas() {
        return repository.findAll();
    }

    // CADASTRAR NOVA INSTITUIÇÃO
    @PostMapping
    public InstituicaoSaude cadastrar(@RequestBody InstituicaoSaude instituicao) {
        return repository.save(instituicao);
    }

    // ATUALIZAR DADOS DA INSTITUIÇÃO
    @PutMapping("/{id}")
    public ResponseEntity<InstituicaoSaude> atualizar(@PathVariable Long id, @RequestBody InstituicaoSaude novosDados) {
        return repository.findById(id).map(instituicao -> {
            instituicao.setNome(novosDados.getNome());
            instituicao.setTipoInstituicao(novosDados.getTipoInstituicao());
            instituicao.setEmail(novosDados.getEmail());
            instituicao.setTelefone(novosDados.getTelefone());
            instituicao.setLinksite(novosDados.getLinksite());
            instituicao.setEndereco(novosDados.getEndereco());
            instituicao.setHorarioSegSex(novosDados.getHorarioSegSex());
            instituicao.setHorarioSabado(novosDados.getHorarioSabado());
            instituicao.setHorarioDomingo(novosDados.getHorarioDomingo());
            return ResponseEntity.ok(repository.save(instituicao));
        }).orElse(ResponseEntity.notFound().build());
    }

    // REMOVER INSTITUIÇÃO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}