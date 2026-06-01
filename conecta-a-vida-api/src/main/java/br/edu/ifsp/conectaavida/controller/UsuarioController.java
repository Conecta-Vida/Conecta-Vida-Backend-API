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

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    // ENDPOINT HERDADO DO MOBILE: Auto-cadastro público do smartphone (/api/usuarios/cadastro)
    @PostMapping("/cadastro")
    public ResponseEntity<?> autoCadastroMobile(@RequestBody Usuario usuario) {
        try {
            Usuario salvo = usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // ENDPOINT WEB ADMIN: Obter todos cadastrados (CR2 CRUD - READ)
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    // ENDPOINT WEB ADMIN: Gravação direta por formulário (CR2 CRUD - CREATE)
    @PostMapping
    public ResponseEntity<Usuario> cadastrarAdmin(@RequestBody Usuario usuario) {
        Usuario salvo = usuarioService.cadastrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // ENDPOINT WEB ADMIN: Modificar dados cadastrais (CR2 CRUD - UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return usuarioRepository.findById(id).map(u -> {
            u.setNome(dados.getNome());
            u.setEmail(dados.getEmail());
            u.setIdade(dados.getIdade());
            u.setSexo(dados.getSexo());
            u.setLocalizacao(dados.getLocalizacao());
            return ResponseEntity.ok(usuarioRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ENDPOINT WEB ADMIN: Deletar registro do banco (CR2 CRUD - DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) return ResponseEntity.notFound().build();
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ATIVAÇÃO DO CR7: Rota Muitos-para-Muitos acionada pelo clique do botão
    @PostMapping("/{usuarioId}/campanhas/{campanhaId}")
    public ResponseEntity<?> inscreverEmCampanha(@PathVariable Long usuarioId, @PathVariable Long campanhaId) {
        try {
            usuarioService.vincularCidadaoACampanha(usuarioId, campanhaId);
            return ResponseEntity.ok(Map.of("mensagem", "Inscrição processada! Relacionamento Muitos-para-Muitos salvo com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", e.getMessage()));
        }
    }

    // EXPORTAÇÃO COMPLETA EM CSV: Constrói a planilha sob demanda anexando metadados HTTP
    @GetMapping("/exportar-csv")
    public ResponseEntity<String> exportarCsv() {
        List<Usuario> lista = usuarioRepository.findAll();
        StringBuilder sb = new StringBuilder("ID;Nome;Email;Idade;Sexo;Permissao\n");
        for (Usuario u : lista) {
            sb.append(u.getId()).append(";").append(u.getNome()).append(";").append(u.getEmail()).append(";")
                    .append(u.getIdade() != null ? u.getIdade() : "").append(";").append(u.getSexo() != null ? u.getSexo() : "").append(";")
                    .append(u.getLocalizacao()).append("\n");
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=usuarios_conecta.csv")
                .header("Content-Type", "text/csv; charset=UTF-8").body(sb.toString());
    }

    // CARGA DE DADOS EM MASSA (UPLOADS): Processamento em lote (Batch Processing) via Stream
    @PostMapping("/importar-csv")
    public ResponseEntity<String> importarCsv(@RequestParam("file") MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            List<Usuario> lote = new ArrayList<>();
            String linha; boolean cabecalho = true;
            while ((linha = br.readLine()) != null) {
                if (cabecalho) { cabecalho = false; continue; }
                String[] c = linha.split(";");
                if (c.length >= 2) {
                    Usuario u = new Usuario(); u.setNome(c[0].trim()); u.setEmail(c[1].trim()); u.setSenha("123456");
                    if (c.length > 2 && !c[2].isEmpty()) u.setIdade(Integer.parseInt(c[2].trim()));
                    if (c.length > 3) u.setSexo(c[3].trim());
                    if (c.length > 4) u.setLocalizacao(c[4].trim());
                    lote.add(u);
                }
            }
            usuarioRepository.saveAll(lote); // Salva a lista inteira de uma só vez de forma otimizada
            return ResponseEntity.ok("Sucesso! Carga processada, " + lote.size() + " cidadãos injetados no Supabase.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no processamento da carga: " + e.getMessage());
        }
    }
}