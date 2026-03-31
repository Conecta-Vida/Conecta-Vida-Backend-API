package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Paciente;
import br.edu.ifsp.conectaavida.repository.PacienteRepository;
import br.edu.ifsp.conectaavida.service.RelatorioService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteRepository repository;

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping
    public List<Paciente> listarTodos() { return repository.findAll(); }

    @PostMapping
    public Paciente cadastrar(@RequestBody Paciente p) { return repository.save(p); }

    // --- NOVA ROTA: EDITAR PACIENTE ---
    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente dados) {
        return repository.findById(id).map(p -> {
            p.setNome(dados.getNome());
            p.setCpf(dados.getCpf());
            p.setDataNascimento(dados.getDataNascimento());
            p.setTipagemSanguinea(dados.getTipagemSanguinea());
            return ResponseEntity.ok(repository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NOVA ROTA: EXCLUIR PACIENTE ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/exportar-pdf")
    public ResponseEntity<byte[]> baixarPdf() {
        byte[] pdf = relatorioService.gerarRelatorioPacientes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=pacientes.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/exportar-csv")
    public void exportarCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=pacientes.csv");
        PrintWriter writer = response.getWriter();
        writer.println("Nome;CPF;Nascimento;Sangue");
        for (Paciente p : repository.findAll()) {
            writer.printf("%s;%s;%s;%s\n", p.getNome(), p.getCpf(), p.getDataNascimento(), p.getTipagemSanguinea());
        }
        writer.close();
    }

    @PostMapping("/importar-csv")
    public ResponseEntity<String> importar(@RequestParam("file") MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");
                if (data.length >= 3) {
                    Paciente p = new Paciente();
                    p.setNome(data[0]); p.setCpf(data[1]); p.setDataNascimento(LocalDate.parse(data[2]));
                    if (data.length > 3) p.setTipagemSanguinea(data[3]);
                    repository.save(p);
                }
            }
            return ResponseEntity.ok("Sucesso!");
        } catch (Exception e) { return ResponseEntity.status(500).body("Erro!"); }
    }
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Paciente> buscarPorCpf(@PathVariable String cpf) {
        return repository.findByCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}