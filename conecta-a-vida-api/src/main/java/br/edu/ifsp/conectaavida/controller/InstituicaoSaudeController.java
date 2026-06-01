package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.InstituicaoSaude;
import br.edu.ifsp.conectaavida.repository.InstituicaoSaudeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class InstituicaoSaudeController {

    @Autowired
    private InstituicaoSaudeRepository instituicaoSaudeRepository;

    // ROTAS GÊMEAS: Atende o painel administrativo e o mapa de postos de saúde do aplicativo móvel
    @PostMapping({"/api/instituicoes", "/api/orgaos"})
    public ResponseEntity<?> cadastrar(@RequestBody InstituicaoSaude instituicao) {
        if (instituicao.getNome() == null || instituicao.getNome().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("O nome da instituição de saúde é obrigatório.");
        }
        InstituicaoSaude salva = instituicaoSaudeRepository.save(instituicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    // LISTAGEM GÊMEA (WEB & MOBILE)
    @GetMapping({"/api/instituicoes", "/api/orgaos"})
    public ResponseEntity<List<InstituicaoSaude>> listarTodas() {
        return ResponseEntity.ok(instituicaoSaudeRepository.findAll());
    }

    // ATUALIZAÇÃO CADASRTAL DE UNIDADES UBS/POSTOS (WEB ADMIN)
    @PutMapping("/api/instituicoes/{id}")
    public ResponseEntity<InstituicaoSaude> atualizar(@PathVariable Long id, @RequestBody InstituicaoSaude novosDados) {
        return instituicaoSaudeRepository.findById(id).map(instituicao -> {
            instituicao.setTipoInstituicao(novosDados.getTipoInstituicao());
            instituicao.setNome(novosDados.getNome());
            instituicao.setEmail(novosDados.getEmail());
            instituicao.setTelefone(novosDados.getTelefone());
            instituicao.setLinksite(novosDados.getLinksite());
            instituicao.setEndereco(novosDados.getEndereco());
            instituicao.setHorarioSegSex(novosDados.getHorarioSegSex());
            instituicao.setHorarioSabado(novosDados.getHorarioSabado());
            instituicao.setHorarioDomingo(novosDados.getHorarioDomingo());
            return ResponseEntity.ok(instituicaoSaudeRepository.save(instituicao));
        }).orElse(ResponseEntity.notFound().build());
    }
}