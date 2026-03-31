package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/pacientes")
    public ResponseEntity<byte[]> baixarRelatorioPacientes() {
        byte[] pdf = relatorioService.gerarRelatorioPacientes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_pacientes.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}