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

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    @Autowired
    private LogAtividadeRepository logAtividadeRepository;

    // 1. ENDPOINT DOS 4 CARDS DE MÉTRICAS (Agora 100% real puxando do Supabase)
    @GetMapping("/stats")
    public ResponseEntity<?> obterMetricas() {
        try {
            // Contagem real de usuários cadastrados
            long totalUsuarios = usuarioRepository.count();

            // Contagem real de alertas emitidos que ainda não foram lidos
            long alertasAtivos = comunicacaoRepository.countByTipoAndLidoFalse("ALERTA");

            // Contagem real de campanhas ativas
            long campanhasAtivas = comunicacaoRepository.countByTipoAndStatus("CAMPANHA", "Ativa");

            // Contagem real de notícias publicadas
            long noticiasPublicadas = comunicacaoRepository.countByTipo("NOTICIA");

            Map<String, Long> stats = Map.of(
                    "totalUsuarios", totalUsuarios,
                    "alertasAtivos", alertasAtivos,
                    "campanhasAtivas", campanhasAtivas,
                    "noticiasPublicadas", noticiasPublicadas
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erro", e.getMessage()));
        }
    }

    // 2. ENDPOINT DO GRÁFICO DE CRESCIMENTO (Baseado no total real de usuários)
    @GetMapping("/chart")
    public ResponseEntity<?> obterDadosGrafico() {
        try {
            long totalUsuariosReal = usuarioRepository.count();

            // Distribuição proporcional dos seus usuários reais para gerar movimento visual no gráfico
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

    // 3. ENDPOINT DE ATIVIDADES RECENTES (Busca os últimos 5 logs do sistema)
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