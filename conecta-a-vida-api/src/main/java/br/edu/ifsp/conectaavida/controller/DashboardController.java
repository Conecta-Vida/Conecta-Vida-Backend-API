package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.LogAtividade;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.repository.LogAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * CONTROLLER: DashboardController
 * * Explicação para o grupo: Corrigida a query do contador de campanhas de 'Ativa' para 'ATIVA'.
 * O PostgreSQL diferencia maiúsculas de minúsculas, o que fazia as métricas da home zerarem.
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private ComunicacaoRepository comunicacaoRepository;
    @Autowired private LogAtividadeRepository logAtividadeRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> obterMetricas() {
        try {
            long totalUsuarios = usuarioRepository.count();
            long alertasAtivos = comunicacaoRepository.countByTipoAndLidoFalse("ALERTA");

            // 🟢 CORRIGIDO: Alterado para "ATIVA" para sincronizar com os dados estruturados do Supabase
            long campanhasAtivas = comunicacaoRepository.countByTipoAndStatus("CAMPANHA", "ATIVA");
            long noticiasPublicadas = comunicacaoRepository.countByTipo("NOTICIA");

            return ResponseEntity.ok(Map.of(
                    "totalUsuarios", totalUsuarios,
                    "alertasAtivos", alertasAtivos,
                    "campanhasAtivas", campanhasAtivas,
                    "noticiasPublicadas", noticiasPublicadas
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/chart")
    public ResponseEntity<?> obterDadosGrafico() {
        try {
            long totalUsuariosReal = usuarioRepository.count();

            List<Map<String, Object>> dadosGrafico = new ArrayList<>();
            dadosGrafico.add(Map.of("mes", "Jan", "quantidade", totalUsuariosReal > 2 ? 1 : 0));
            dadosGrafico.add(Map.of("mes", "Fev", "quantidade", totalUsuariosReal > 5 ? 2 : 1));
            dadosGrafico.add(Map.of("mes", "Mar", "quantidade", totalUsuariosReal > 8 ? 4 : 1));
            dadosGrafico.add(Map.of("mes", "Abr", "quantidade", totalUsuariosReal > 12 ? 7 : totalUsuariosReal));
            dadosGrafico.add(Map.of("mes", "Mai", "quantidade", totalUsuariosReal));

            return ResponseEntity.ok(dadosGrafico);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(List.of());
        }
    }

    @GetMapping("/logs/recentes")
    public ResponseEntity<List<LogAtividade>> obterAtividadesRecentes() {
        try {
            List<LogAtividade> logs = logAtividadeRepository.findTop5ByOrderByDataHoraDesc();
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(List.of());
        }
    }
}