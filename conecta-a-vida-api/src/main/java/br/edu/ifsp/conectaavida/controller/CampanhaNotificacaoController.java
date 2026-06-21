package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.domain.UsuarioCampanha;
import br.edu.ifsp.conectaavida.domain.LogAtividade;
import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import br.edu.ifsp.conectaavida.repository.UsuarioCampanhaRepository;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.repository.LogAtividadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * CONTROLADOR: CampanhaNotificacaoController
 * 
 * Propósito: Gerenciar notificações de fim de campanha, vinculação de usuários
 * a campanhas e auditoria de atividades relacionadas.
 * 
 * Requisitos Atendidos:
 * - CR7: Relacionamento muitos-para-muitos com auditoria
 * - Envio de notificações de fim de campanha
 * - Rastreamento de inscrições e notificações
 */
@RestController
@RequestMapping("/api/campanhas")
public class CampanhaNotificacaoController {

    @Autowired
    private ComunicacaoRepository comunicacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioCampanhaRepository usuarioCampanhaRepository;

    @Autowired
    private LogAtividadeRepository logAtividadeRepository;

    /**
     * Endpoint: POST /api/campanhas/{comunicacaoId}/inscrever
     * 
     * Permite que um usuário se inscreva em uma campanha/comunicação.
     * A inscrição é rastreada com data e hora automáticas.
     */
    @PostMapping("/{comunicacaoId}/inscrever")
    public ResponseEntity<?> inscreverUsuario(
            @PathVariable Long comunicacaoId,
            @RequestBody Map<String, Long> payload) {
        try {
            Long usuarioId = payload.get("usuario_id");
            if (usuarioId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "usuario_id é obrigatório."));
            }

            var usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new Exception("Usuário não encontrado."));
            var comunicacao = comunicacaoRepository.findById(comunicacaoId)
                    .orElseThrow(() -> new Exception("Comunicação/Campanha não encontrada."));

            // Verifica duplicidade de inscrição
            var jaInscrito = usuarioCampanhaRepository
                    .findByUsuarioIdAndComunicacaoId(usuarioId, comunicacaoId);
            if (jaInscrito.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "Usuário já está inscrito nesta campanha."));
            }

            // Cria nova inscrição
            UsuarioCampanha inscricao = new UsuarioCampanha();
            inscricao.setUsuario(usuario);
            inscricao.setComunicacao(comunicacao);
            UsuarioCampanha salva = usuarioCampanhaRepository.save(inscricao);

            // Registra na trilha de auditoria
            Usuario admin = usuarioRepository.findTopByPermissao("Administrador").orElse(null);
            if (admin != null) {
                LogAtividade log = new LogAtividade();
                log.setUsuario(admin);
                log.setAcao("Usuário " + usuario.getEmail() + " inscrito na campanha: " + comunicacao.getTitulo());
                logAtividadeRepository.save(log);
            }

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Inscrição realizada com sucesso.",
                    "inscricao_id", salva.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensagem", "Erro ao inscrever usuário: " + e.getMessage()));
        }
    }

    /**
     * Endpoint: POST /api/campanhas/{comunicacaoId}/notificar-fim
     * 
     * Dispara notificação de fim de campanha para todos os usuários inscritos
     * que ainda não receberam a notificação.
     * 
     * Uso acadêmico: Demonstra auditoria em lote, atualização condicional de registros
     * e rastreamento de quem foi notificado e quando.
     */
    @PostMapping("/{comunicacaoId}/notificar-fim")
    public ResponseEntity<?> notificarFimCampanha(@PathVariable Long comunicacaoId) {
        try {
            var comunicacao = comunicacaoRepository.findById(comunicacaoId)
                    .orElseThrow(() -> new Exception("Campanha não encontrada."));

            // Busca inscrições que ainda não foram notificadas
            List<UsuarioCampanha> naNotificadas = 
                    usuarioCampanhaRepository.findNaoNotificadasPorComunicacao(comunicacaoId);

            if (naNotificadas.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "mensagem", "Nenhuma notificação pendente para esta campanha.",
                        "notificadas_count", 0
                ));
            }

            LocalDateTime agora = LocalDateTime.now();

            // Marca todas como notificadas
            for (UsuarioCampanha inscricao : naNotificadas) {
                inscricao.setDataNotificacaoFim(agora);
                inscricao.setNotificacaoLida(false);
                usuarioCampanhaRepository.save(inscricao);
            }

            // Registra auditoria consolidada
            Usuario admin = usuarioRepository.findTopByPermissao("Administrador").orElse(null);
            if (admin != null) {
                LogAtividade log = new LogAtividade();
                log.setUsuario(admin);
                log.setAcao("Notificação de FIM DE CAMPANHA enviada para " + naNotificadas.size() + 
                           " usuários inscritos em: " + comunicacao.getTitulo());
                logAtividadeRepository.save(log);
            }

            return ResponseEntity.ok(Map.of(
                    "mensagem", "Notificação disparada com sucesso.",
                    "notificadas_count", naNotificadas.size(),
                    "campanha", comunicacao.getTitulo(),
                    "data_notificacao", agora.toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensagem", "Erro ao notificar fim de campanha: " + e.getMessage()));
        }
    }

    /**
     * Endpoint: GET /api/campanhas/{comunicacaoId}/inscritos
     * 
     * Lista todos os usuários inscritos em uma campanha e seu status de notificação.
     */
    @GetMapping("/{comunicacaoId}/inscritos")
    public ResponseEntity<?> listarInscritos(@PathVariable Long comunicacaoId) {
        try {
            List<UsuarioCampanha> inscritos = usuarioCampanhaRepository
                    .findByComunicacaoId(comunicacaoId);

            return ResponseEntity.ok(Map.of(
                    "total_inscritos", inscritos.size(),
                    "inscritos", inscritos.stream().map(uc -> Map.of(
                            "usuario_id", uc.getUsuario().getId(),
                            "usuario_nome", uc.getUsuario().getNome(),
                            "usuario_email", uc.getUsuario().getEmail(),
                            "data_inscricao", uc.getDataInscricao().toString(),
                            "data_notificacao_fim", uc.getDataNotificacaoFim() != null 
                                    ? uc.getDataNotificacaoFim().toString() 
                                    : "Pendente",
                            "notificacao_lida", uc.getNotificacaoLida()
                    )).toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensagem", "Erro ao listar inscritos: " + e.getMessage()));
        }
    }

    /**
     * Endpoint: DELETE /api/campanhas/{comunicacaoId}/desinscrever
     * 
     * Remove a inscrição de um usuário de uma campanha.
     * Demonstra operações de limpeza com cascata segura.
     */
    @DeleteMapping("/{comunicacaoId}/desinscrever")
    public ResponseEntity<?> desinscreverUsuario(
            @PathVariable Long comunicacaoId,
            @RequestBody Map<String, Long> payload) {
        try {
            Long usuarioId = payload.get("usuario_id");
            if (usuarioId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "usuario_id é obrigatório."));
            }

            var inscricao = usuarioCampanhaRepository
                    .findByUsuarioIdAndComunicacaoId(usuarioId, comunicacaoId)
                    .orElseThrow(() -> new Exception("Inscrição não encontrada."));

            usuarioCampanhaRepository.delete(inscricao);

            // Auditoria
            Usuario admin = usuarioRepository.findTopByPermissao("Administrador").orElse(null);
            if (admin != null) {
                LogAtividade log = new LogAtividade();
                log.setUsuario(admin);
                log.setAcao("Usuário desinscrito da campanha. Inscrição ID: " + inscricao.getId());
                logAtividadeRepository.save(log);
            }

            return ResponseEntity.ok(Map.of("mensagem", "Desinscricao realizada com sucesso."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensagem", "Erro ao desinscrever: " + e.getMessage()));
        }
    }
}
