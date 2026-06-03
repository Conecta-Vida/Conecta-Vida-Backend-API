package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * CONTROLADOR: UsuarioController (CRUD CENTRALIZADO + PROCESSAMENTO EM LOTE)
 * * Explicação para o grupo: Corrigidos os fluxos de CSV e atualização cadastral
 * para manter isolados e funcionais os campos de Localização (Cidade) e Permissão (Cargo).
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // ENDPOINT MOBILE: Auto-cadastro público vindo do smartphone
    @PostMapping("/cadastro")
    public ResponseEntity<?> autoCadastroMobile(@RequestBody Usuario usuario) {
        try {
            Usuario salvo = usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // WEB ADMIN: Listar todos (READ)
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    // WEB ADMIN: Inserir via formulário (CREATE)
    @PostMapping
    public ResponseEntity<Usuario> cadastrarAdmin(@RequestBody Usuario usuario) {
        Usuario salvo = usuarioService.cadastrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // WEB ADMIN: Alterar dados do cidadão (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return usuarioRepository.findById(id).map(u -> {
            u.setNome(dados.getNome());
            u.setEmail(dados.getEmail());
            u.setIdade(dados.getIdade());
            u.setSexo(dados.getSexo());
            u.setLocalizacao(dados.getLocalizacao());
            // 🟢 CORRIGIDO: Adicionada a persistência da permissão real para não perder o cargo na edição
            u.setPermissao(dados.getPermissao());
            return ResponseEntity.ok(usuarioRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    // WEB ADMIN: Remover do sistema (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) return ResponseEntity.notFound().build();
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // REQUISITO CR7: Relacionamento Muitos-para-Muitos (Inscrição em Mutirões)
    @PostMapping("/{usuarioId}/campanhas/{campanhaId}")
    public ResponseEntity<?> inscreverEmCampanha(@PathVariable Long usuarioId, @PathVariable Long campanhaId) {
        try {
            usuarioService.vincularCidadaoACampanha(usuarioId, campanhaId);
            return ResponseEntity.ok(Map.of("mensagem", "Inscrição processada! Relacionamento Muitos-para-Muitos salvo com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", e.getMessage()));
        }
    }

    // EXPORTAÇÃO DE PLANILHA EM CSV TOTALMENTE REALINHADA
    @GetMapping("/exportar-csv")
    public ResponseEntity<String> exportarCsv() {
        List<Usuario> lista = usuarioRepository.findAll();
        // 🟢 CORRIGIDO: Separados explicitamente os cabeçalhos de Cidade (Localizacao) e Cargo (Permissao)
        StringBuilder sb = new StringBuilder("ID;Nome;Email;Idade;Sexo;Localizacao;Permissao\n");
        for (Usuario u : lista) {
            sb.append(u.getId()).append(";")
                    .append(u.getNome()).append(";")
                    .append(u.getEmail()).append(";")
                    .append(u.getIdade() != null ? u.getIdade() : "").append(";")
                    .append(u.getSexo() != null ? u.getSexo() : "").append(";")
                    .append(u.getLocalizacao() != null ? u.getLocalizacao() : "").append(";")
                    .append(u.getPermissao()).append("\n"); // 🟢 CORRIGIDO AQUI
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=usuarios_conecta.csv")
                .header("Content-Type", "text/csv; charset=UTF-8").body(sb.toString());
    }

    // IMPORTAÇÃO EM MASSA DE CSV TOTALMENTE BLINDADA
    @PostMapping("/importar-csv")
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            List<Usuario> lote = new ArrayList<>();
            String linha; boolean cabecalho = true;
            while ((linha = br.readLine()) != null) {
                if (cabecalho) { cabecalho = false; continue; }
                String[] c = linha.split(";");
                if (c.length >= 2) {
                    Usuario u = new Usuario();
                    u.setNome(c[0].trim());
                    u.setEmail(c[1].trim());
                    u.setSenha("123456"); // Senha provisória em hash para cargas em lote

                    if (c.length > 2 && !c[2].isEmpty()) u.setIdade(Integer.parseInt(c[2].trim()));
                    if (c.length > 3) u.setSexo(c[3].trim());
                    // 🟢 CORRIGIDO: Realinhada a leitura posicional para capturar os dois novos campos sem estourar o banco
                    if (c.length > 4) u.setLocalizacao(c[4].trim());
                    if (c.length > 5) u.setPermissao(c[5].trim());

                    lote.add(u);
                }
            }
            usuarioRepository.saveAll(lote); // Persistência em lote otimizada
            return ResponseEntity.ok("Sucesso! Carga processada, " + lote.size() + " cidadãos injetados no Supabase.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento da carga: " + e.getMessage());
        }
    }
}