package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired private UsuarioRepository repository;
    @Autowired private UsuarioService service;

    @GetMapping
    public List<Usuario> listarTodos() { return repository.findAll(); }

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario u) { return repository.save(u); }

    // ATENÇÃO EQUIPE: Update. ID como Integer para buscar no banco.
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Integer id, @RequestBody Usuario dados) {
        return repository.findById(id).map(u -> {
            u.setNome(dados.getNome());
            u.setEmail(dados.getEmail());
            u.setSenha(dados.getSenha());
            u.setIdade(dados.getIdade());
            u.setSexo(dados.getSexo());
            u.setLocalizacao(dados.getLocalizacao());
            return ResponseEntity.ok(repository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exportar-csv")
    public void exportarCsv(HttpServletResponse response) throws Exception {
        // O fluxo pesado fica no Service, deixando o Controller responsável só pela rota.
        service.exportarCsv(response);
    }

    // @RequestParam avisa que vamos receber um upload de arquivo chamado "file" (Multipart)
    @PostMapping("/importar-csv")
    public ResponseEntity<String> importar(@RequestParam("file") MultipartFile file) {
        try {
            service.importarCsv(file);
            return ResponseEntity.ok("Sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro na importação: " + e.getMessage());
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        return repository.findByEmail(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}