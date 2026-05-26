package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

/**
 * CONTROLLER: RelatorioController
 * Rota Base: /api/relatorios
 */
@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioController {

    @Autowired private RelatorioService relatorioService;

    /**
     * GET /api/relatorios/usuarios
     * Produz o download do relatório geral de cadastro formatado pelo iText
     */
    @GetMapping("/usuarios")
    public ResponseEntity<byte[]> baixarRelatorioUsuarios() {
        byte[] pdf = relatorioService.gerarRelatorioUsuarios();

        // Configura cabeçalhos de anexo nativo (Content-Disposition) forçando o browser a baixar em vez de navegar
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_usuarios.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}