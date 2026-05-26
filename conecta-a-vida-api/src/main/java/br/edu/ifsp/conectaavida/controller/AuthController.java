package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CONTROLLER: AuthController
 * Rota Base: /api/auth
 * Objetivo: Validar credenciais de administradores e disparar contra-medidas de segurança.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite o consumo de qualquer origem (essencial para o React local)
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private JavaMailSender mailSender; // Motor SMTP injetado para envio automático de e-mails

    // ConcurrentHashMap: Linha de defesa na memória para contar erros seguidos por e-mail sem travar a aplicação
    private final Map<String, Integer> tentativasFalhadas = new ConcurrentHashMap<>();

    /**
     * POST /api/auth/login
     * Processa a tentativa de autenticação institucional.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        // REGRA 1: Se o e-mail não existir ou a senha não coincidir com o banco de dados
        if (usuarioOpt.isEmpty() || !usuarioOpt.get().getSenha().equals(senha)) {
            // Incrementa o número de falhas deste e-mail específico na memória
            int falhas = tentativasFalhadas.merge(email, 1, Integer::sum);

            // Se atingir 3 ou mais erros consecutivos, ativa o alarme por e-mail
            if (falhas >= 3) {
                enviarAlertaSeguranca(email, falhas);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensagem", "Credenciais incorretas."));
        }

        Usuario usuario = usuarioOpt.get();

        // REGRA 2: Bloqueia utilizadores comuns. Apenas utilizadores com cargo "Administrador" avançam
        if (!"Administrador".equalsIgnoreCase(usuario.getLocalizacao())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("mensagem", "Você não tem credencial liberada."));
        }

        // Sucesso total: limpa o histórico de erros do utilizador e inicia a sessão
        tentativasFalhadas.remove(email);
        return ResponseEntity.ok(usuario);
    }

    /**
     * Rotina interna assíncrona para despachar e-mails de alerta via TLS
     */
    private void enviarAlertaSeguranca(String emailTentativa, int quantidade) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setTo("luizhe2004@gmail.com");
            mensagem.setSubject("⚠️ ALERTA DE SEGURANÇA: Tentativas de Invasão");
            mensagem.setText("Olá Administrador,\n\n" +
                    "O sistema detetou que o e-mail '" + emailTentativa + "' tentou aceder ao painel administrativo " +
                    quantidade + " vezes consecutivas com dados errados.\n\n" +
                    "Se não foi você, recomendamos monitorizar a segurança da base de dados.\n\n" +
                    "Atentamente,\nEquipa Conecta à Vida.");

            mailSender.send(mensagem);
        } catch (Exception e) {
            System.out.println("Erro técnico ao disparar e-mail: " + e.getMessage());
        }
    }
}