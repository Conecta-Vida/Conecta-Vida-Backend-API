package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.service.UsuarioService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * CONTROLLER: UsuarioController
 * Rota Base: /api/usuarios
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final UsuarioService service;

    // Injeção de Dependência recomendada via Construtor
    public UsuarioController(UsuarioRepository repository, UsuarioService service) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        return repository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return repository.findById(id).map(usuario -> {
            usuario.setNome(dados.getNome());
            usuario.setEmail(dados.getEmail());
            if (dados.getSenha() != null && !dados.getSenha().isEmpty()) {
                usuario.setSenha(dados.getSenha());
            }
            usuario.setIdade(dados.getIdade());
            usuario.setSexo(dados.getSexo());
            usuario.setLocalizacao(dados.getLocalizacao());
            return ResponseEntity.ok(repository.save(usuario));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content (Sem corpo de resposta)
    }

    @GetMapping("/exportar-csv")
    public void exportarCsv(HttpServletResponse response) throws Exception {
        service.exportarCsv(response);
    }

    @PostMapping("/importar-csv")
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        try {
            service.importarCsv(file);
            return ResponseEntity.ok("Ficheiro CSV importado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}