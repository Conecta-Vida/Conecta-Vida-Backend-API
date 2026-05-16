package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired private RelatorioService relatorioService;

    @GetMapping("/usuarios")
    public ResponseEntity<byte[]> baixarRelatorioUsuarios() {
        byte[] pdf = relatorioService.gerarRelatorioUsuarios();

        // Retorna o arquivo PDF dizendo ao navegador como exibi-lo (application/pdf).
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_usuarios.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}