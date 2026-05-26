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

/**
 * CLASSE: UsuarioService
 * Objetivo: Tratar importações e exportações de dados em massa usando o formato universal CSV.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    /**
     * PROCESSAMENTO EM LOTE: Importação de ficheiros CSV
     * Lê um arquivo enviado via React e salva centenas de utilizadores com uma única chamada ao banco.
     */
    public void importarCsv(MultipartFile file) {
        // Abre o leitor de arquivos configurado com codificação UTF-8 para não estragar acentos ou cedilhas (ç)
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            br.readLine(); // IMPORTANTE: Pula a primeira linha (cabeçalho) do arquivo CSV ("ID;Nome;Email...")
            String line;

            // Otimização de Performance: Criamos uma lista em lote (Batch) na memória
            List<Usuario> usuariosBatch = new ArrayList<>();

            // Lê linha por linha do arquivo até chegar ao fim (nulo)
            while ((line = br.readLine()) != null) {
                // Divide a linha de texto em um array de palavras usando o caractere ";" como separador
                String[] data = line.split(";");

                // Valida se a linha possui pelo menos os dois campos obrigatórios: Nome e E-mail
                if (data.length >= 2) {
                    Usuario u = new Usuario();
                    u.setNome(data[0]);
                    u.setEmail(data[1]);

                    // Nota de Segurança: A senha nasce por padrão como "123456".
                    // No futuro, deve passar por um codificador como o BCryptPasswordEncoder!
                    u.setSenha("123456");

                    // Preenche campos opcionais caso existam na linha do CSV
                    if (data.length > 2 && !data[2].isEmpty()) u.setIdade(Integer.parseInt(data[2]));
                    if (data.length > 3) u.setSexo(data[3]);
                    if (data.length > 4) u.setLocalizacao(data[4]);

                    usuariosBatch.add(u); // Adiciona na nossa lista temporária
                }
            }

            // OTIMIZAÇÃO: Em vez de fazer centenas de "INSERT" individuais (o que deixaria o Supabase lento),
            // fazemos um único comando coletivo salvando a lista inteira de uma vez só (.saveAll)
            if (!usuariosBatch.isEmpty()) {
                repository.saveAll(usuariosBatch);
            }
        } catch (Exception e) {
            throw new RuntimeException("Falha ao processar e salvar o arquivo CSV", e);
        }
    }

    /**
     * EXPORTAÇÃO DINÂMICA: Transmite uma planilha CSV direto para o navegador do Admin
     */
    public void exportarCsv(HttpServletResponse response) throws Exception {
        // Define as regras do protocolo HTTP para avisar o navegador que um arquivo está sendo enviado
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=usuarios.csv");

        // Abre o escritor de textos ligado à resposta HTTP
        try (PrintWriter writer = response.getWriter()) {
            // Escreve a linha que serve como cabeçalho das colunas da planilha
            writer.println("ID;Nome;Email;Idade;Sexo;Localizacao");

            // Varre toda a tabela de usuários, formatando os dados separados por ";"
            for (Usuario u : repository.findAll()) {
                writer.printf("%d;%s;%s;%d;%s;%s\n",
                        u.getId(), u.getNome(), u.getEmail(), u.getIdade(), u.getSexo(), u.getLocalizacao());
            }
        }
    }
}