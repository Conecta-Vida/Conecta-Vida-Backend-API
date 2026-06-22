package br.edu.ifsp.conectaavida.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Gerencia tokens FCM dos dispositivos para envio de push notifications.
 * Os tokens ficam em memória RAM por ser um projeto acadêmico.
 * Em produção, deveria salvar no banco de dados por usuário.
 */
@RestController
@RequestMapping("/api/push")
@CrossOrigin(origins = "*")
public class PushTokenController {

    // Armazena tokens únicos de todos os dispositivos registrados
    private static final Set<String> tokensRegistrados =
            ConcurrentHashMap.newKeySet();

    /**
     * Recebe e salva o token FCM enviado pelo app mobile ao iniciar.
     * POST /api/push/registrar-token
     */
    @PostMapping("/registrar-token")
    public ResponseEntity<?> registrarToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensagem", "Token FCM é obrigatório."));
        }
        tokensRegistrados.add(token);
        System.out.println("📱 Token FCM registrado: " + token.substring(0, 20) + "...");
        return ResponseEntity.ok(Map.of(
                "mensagem", "Token registrado com sucesso.",
                "total_dispositivos", tokensRegistrados.size()
        ));
    }

    /**
     * Retorna todos os tokens registrados (uso interno pelo FcmService).
     */
    public static Set<String> getTokens() {
        return tokensRegistrados;
    }

    /**
     * Lista os dispositivos registrados (útil para debug no painel admin).
     * GET /api/push/dispositivos
     */
    @GetMapping("/dispositivos")
    public ResponseEntity<?> listarDispositivos() {
        return ResponseEntity.ok(Map.of(
                "total", tokensRegistrados.size(),
                "tokens", tokensRegistrados.stream()
                        .map(t -> t.substring(0, Math.min(20, t.length())) + "...")
                        .toList()
        ));
    }
}
