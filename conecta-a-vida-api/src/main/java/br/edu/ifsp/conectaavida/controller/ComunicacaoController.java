package br.edu.ifsp.conectaavida.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.domain.LogAtividade;
import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.repository.LogAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * CONTROLLER: ComunicacaoController
 * 🟢 PRESERVAÇÃO TOTAL: Mantido o mapeamento polimórfico de criação e remoção segura de campanhas.
 * ⚡ ADIÇÃO DA TRILHA: Grava logs automáticos de postagens e deleções de informativos.
 */
@RestController
@RequestMapping("/api/comunicacoes")
public class ComunicacaoController {

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private LogAtividadeRepository logAtividadeRepository;

    @PostMapping
    public ResponseEntity<?> cadastrarComunicacao(@RequestBody Comunicacao comunicacao) {
        try {
            comunicacao.setDataPostada(LocalDateTime.now());
            Comunicacao salva = comunicacaoRepository.save(comunicacao);

            // 💥 REGISTRO DA TRILHA EM TEMPO REAL
            Usuario adminLogado = usuarioRepository.findAll().stream()
                    .filter(u -> "Administrador".equalsIgnoreCase(u.getPermissao()))
                    .findFirst().orElse(null);

            if (adminLogado != null) {
                LogAtividade log = new LogAtividade();
                log.setUsuario(adminLogado);
                log.setAcao("Publicou uma nova " + salva.getTipo() + " no sistema (Título: " + salva.getTitulo() + ")");
                logAtividadeRepository.save(log);
            }

            return ResponseEntity.ok(salva);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", e.getLocalizedMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarComunicacao(@PathVariable Long id) {
        return comunicacaoRepository.findById(id).map(comunicacao -> {

            // Captura o admin antes de deletar a comunicação
            Usuario adminLogado = usuarioRepository.findAll().stream()
                    .filter(u -> "Administrador".equalsIgnoreCase(u.getPermissao()))
                    .findFirst().orElse(null);

            // Desvincula usuários do Flutter inscritos (tabela associativa)
            usuarioRepository.findAll().forEach(usuario -> {
                if (usuario.getCampanhasInscritas() != null) {
                    if (usuario.getCampanhasInscritas().removeIf(c -> c.getId().equals(id))) {
                        usuarioRepository.save(usuario);
                    }
                }
            });

            comunicacaoRepository.delete(comunicacao);

            // 💥 REGISTRO DA TRILHA EM TEMPO REAL
            if (adminLogado != null) {
                LogAtividade log = new LogAtividade();
                log.setUsuario(adminLogado);
                log.setAcao("Excluiu permanentemente a publicação/campanha: " + comunicacao.getTitulo());
                logAtividadeRepository.save(log);
            }

            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Adicione isto no ComunicacaoController.java
    @GetMapping
    public ResponseEntity<List<Comunicacao>> listarTodas() {
        return ResponseEntity.ok(comunicacaoRepository.findAll());
    }
}