package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import br.edu.ifsp.conectaavida.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CONTROLADOR OBRIGATÓRIO DO CRITERIO CR8 (AUTENTICAÇÃO)
 * Protege o sistema contra ataques de força bruta e dispara e-mails automáticos via SMTP do Gmail.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JavaMailSender mailSender;

    // Mapa em memória RAM para controlar erros consecutivos de login por e-mail
    private final Map<String, Integer> tentativasPorEmail = new ConcurrentHashMap<>();

    // ROTA CR8: Criar conta (/api/auth/register)
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        try {
            // Define permissão padrão caso venha vazia do cadastro mobile
            if (nuevoUsuario.getPermissao() == null) {
                nuevoUsuario.setPermissao("Usuário Comum");
            }
            Usuario salvo = usuarioService.cadastrarUsuario(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("mensagem", "Erro interno ao processar registro."));
        }
    }

    // ROTA CR8: Autenticar e emitir Token (/api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senhaPura = credenciais.get("senha");

        // Se o e-mail já excedeu as 3 tentativas na sessão atual, barra imediatamente
        if (tentativasPorEmail.getOrDefault(email, 0) >= 3) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensagem", "⚠️ Acesso temporariamente suspenso! Você excedeu o limite de 3 tentativas consecutivas de login."));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        String hashVerificacao = usuarioService.criptografarSenha(senhaPura);

        // MECANISMO ANTI-INTRUSÃO: Validação preventiva de tentativas falhas consecutivas
        if (usuarioOpt.isEmpty() || !usuarioOpt.get().getSenha().equals(hashVerificacao)) {
            int tentativas = tentativasPorEmail.getOrDefault(email, 0) + 1;
            tentativasPorEmail.put(email, tentativas);

            if (tentativas >= 3) {
                dispararEmailAlertaInvasao(email); // Envia aviso SMTP de segurança
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("mensagem", "⚠️ Credenciais inválidas. Limite de 3 tentativas excedido! Esta conta foi bloqueada e um e-mail de alerta foi enviado."));
            }

            int restantes = 3 - tentativas;
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensagem", "Credenciais inválidas. Atenção, você tem mais " + restantes + " tentativa(s) antes do bloqueio."));
        }

        Usuario usuario = usuarioOpt.get();
        tentativasPorEmail.remove(email); // Reseta contagem de erros se acertar

        String tokenJwtSimulado = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                Base64.getUrlEncoder().withoutPadding().encodeToString(usuario.getEmail().getBytes()) +
                ".assinatura_segura_sha256";

        // Retorna o pacote JSON completo esperado pelo painel administrativo e mobile
        return ResponseEntity.ok(Map.of(
                "token", tokenJwtSimulado,
                "id", usuario.getId(),
                "nome", usuario.getNome(),
                "email", usuario.getEmail(),
                "permissao", usuario.getPermissao(), // Envia o nível de acesso real (Administrador)
                "localizacao", usuario.getLocalizacao() != null ? usuario.getLocalizacao() : "" // Mantém o bairro disponível
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("mensagem", "Sessão encerrada com sucesso no servidor do IFSP."));
    }

    private void dispararEmailAlertaInvasao(String emailDestinatario) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setFrom("seguranca@conectaavida.com.br");
            mensagem.setTo(emailDestinatario);
            mensagem.setSubject("⚠️ ALERTA DE SEGURANÇA: Tentativas de Invasão de Conta Detectadas");
            mensagem.setText("Olá,\n\n" +
                    "Identificamos 3 tentativas consecutivas e incorretas de login utilizando o seu endereço de e-mail (" + emailDestinatario + ") no Painel do Conecta à Vida.\n\n" +
                    "O acesso para esta conta foi SUSPENSO temporariamente na nossa API REST.\n\n" +
                    "Atenciosamente,\n" +
                    "Módulo de Auditoria e Segurança - IFSP Câmpus Bragança Paulista");

            mailSender.send(mensagem);
            System.out.println("📧 Trilha de Segurança: E-mail de alerta enviado para: " + emailDestinatario);
        } catch (Exception e) {
            System.err.println("❌ Falha ao disparar e-mail de segurança: " + e.getMessage());
        }
    }
}