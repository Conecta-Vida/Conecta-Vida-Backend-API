package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    public UsuarioService(UsuarioRepository repository) { this.repository = repository; }

    public void importarCsv(MultipartFile file) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            br.readLine(); // Pula o cabeçalho do CSV
            String line;
            List<Usuario> usuariosBatch = new ArrayList<>();

            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");
                if (data.length >= 2) {
                    Usuario u = new Usuario();
                    u.setNome(data[0]);
                    u.setEmail(data[1]);
                    u.setSenha("123456"); // Criptografar depois!
                    if (data.length > 2 && !data[2].isEmpty()) u.setIdade(Integer.parseInt(data[2]));
                    if (data.length > 3) u.setSexo(data[3]);
                    if (data.length > 4) u.setLocalizacao(data[4]);
                    usuariosBatch.add(u);
                }
            }
            if (!usuariosBatch.isEmpty()) repository.saveAll(usuariosBatch);
        } catch (Exception e) {
            throw new RuntimeException("Falha ao processar o arquivo CSV", e);
        }
    }

    public void exportarCsv(HttpServletResponse response) throws Exception {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=usuarios.csv");

        try (PrintWriter writer = response.getWriter()) {
            writer.println("ID;Nome;Email;Idade;Sexo;Localizacao");
            for (Usuario u : repository.findAll()) {
                writer.printf("%d;%s;%s;%d;%s;%s\n",
                        u.getId(), u.getNome(), u.getEmail(), u.getIdade(), u.getSexo(), u.getLocalizacao());
            }
        }
    }
}