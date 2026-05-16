package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios") // A rota agora é /api/usuarios
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listarTodos() { return repository.findAll(); }

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario u) { return repository.save(u); }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
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
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exportar-csv")
    public void exportarCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=usuarios.csv");
        PrintWriter writer = response.getWriter();
        writer.println("Nome;Email;Idade;Sexo;Localizacao");
        for (Usuario u : repository.findAll()) {
            writer.printf("%s;%s;%d;%s;%s\n", u.getNome(), u.getEmail(), u.getIdade(), u.getSexo(), u.getLocalizacao());
        }
        writer.close();
    }

    @PostMapping("/importar-csv")
    public ResponseEntity<String> importar(@RequestParam("file") MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            br.readLine(); // pular a primeira linha (cabeçalho)
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");
                if (data.length >= 2) {
                    Usuario u = new Usuario();
                    u.setNome(data[0]);
                    u.setEmail(data[1]);

                    // Coloca uma senha padrão para os usuários importados via CSV
                    u.setSenha("123456");

                    if (data.length > 2 && !data[2].isEmpty()) u.setIdade(Integer.parseInt(data[2]));
                    if (data.length > 3) u.setSexo(data[3]);
                    if (data.length > 4) u.setLocalizacao(data[4]);

                    repository.save(u);
                }
            }
            return ResponseEntity.ok("Sucesso!");
        } catch (Exception e) { return ResponseEntity.status(500).body("Erro na importação!"); }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        return repository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}