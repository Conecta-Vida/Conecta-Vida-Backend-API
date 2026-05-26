package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender; // 💡 IMPORT CORRIGIDO AQUI
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private JavaMailSender mailSender;

    // Mapa em memória para monitorizar tentativas falhadas por e-mail
    private final Map<String, Integer> tentativasFalhadas = new ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> usuarioOpt = repository.findByEmail(email);

        // Se o utilizador não existir ou a senha estiver incorreta
        if (usuarioOpt.isEmpty() || !usuarioOpt.get().getSenha().equals(senha)) {
            // Incrementa o número de falhas para este e-mail
            int falhas = tentativasFalhadas.merge(email, 1, Integer::sum);

            // Se atingir 3 ou mais tentativas erradas, envia o e-mail de alerta
            if (falhas >= 3) {
                enviarAlertaSeguranca(email, falhas);
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensagem", "Credenciais incorretas."));
        }

        Usuario usuario = usuarioOpt.get();

        // VALIDAÇÃO CRÍTICA: Bloqueia o acesso se NÃO for um Administrador
        if (!"Administrador".equalsIgnoreCase(usuario.getLocalizacao())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("mensagem", "Você não tem credencial liberada."));
        }

        // Se o login for bem-sucedido, limpa o histórico de erros do e-mail
        tentativasFalhadas.remove(email);

        // Retorna os dados do administrador logado
        return ResponseEntity.ok(usuario);
    }

    // Método auxiliar que dispara o e-mail usando o servidor SMTP configurado
    private void enviarAlertaSeguranca(String emailTentativa, int quantidade) {
        try {
            SimpleMailMessage mensagem = new SimpleMailMessage();
            mensagem.setTo("luizhe2004@gmail.com"); // E-mail do Administrador Master
            mensagem.setSubject("⚠️ ALERTA DE SEGURANÇA: Tentativas de Invasão");
            mensagem.setText("Olá Administrador,\n\n" +
                    "O sistema detetou que o e-mail '" + emailTentativa + "' tentou aceder ao painel administrativo " +
                    quantidade + " vezes consecutivas com dados errados.\n\n" +
                    "Se não foi você, recomendamos monitorizar a segurança da base de dados.\n\n" +
                    "Atentamente,\nEquipa Conecta à Vida.");

            mailSender.send(mensagem);
        } catch (Exception e) {
            System.out.println("Erro ao enviar e-mail de alerta: " + e.getMessage());
        }
    }
}