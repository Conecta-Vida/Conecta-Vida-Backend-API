package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Usuario;
import br.edu.ifsp.conectaavida.repository.UsuarioRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;

/**
 * CLASSE: RelatorioService
 * Objetivo: Extrair dados de utilizadores e gerar um relatório profissional em formato PDF.
 */
@Service
public class RelatorioService {

    private final UsuarioRepository repository;
    public RelatorioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    /**
     * Gera o PDF em tempo real e retorna os dados convertidos num array de bytes (byte[]).
     * Esse formato permite ao Controller enviar o arquivo pela rede de forma leve.
     */
    public byte[] gerarRelatorioUsuarios() {
        // try-with-resources: Garante que os fluxos de escrita de dados serão fechados sozinhos ao fim do processo
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Infraestrutura padrão do iText:
            PdfWriter writer = new PdfWriter(out);       // Escreve os bits no fluxo de saída
            PdfDocument pdf = new PdfDocument(writer);   // Controla a estrutura lógica do PDF (páginas, metadados)
            Document document = new Document(pdf);       // O documento físico onde adicionamos elementos visuais

            // PASSO 1: Cabeçalho do Relatório
            document.add(new Paragraph("Relatório de Usuários - Conecta à Vida").setFontSize(18).setBold());
            document.add(new Paragraph("Documento gerado em: " + java.time.LocalDateTime.now() + "\n"));

            // PASSO 2: Configuração da Tabela Flutuante
            // Define a proporção das 4 colunas (ID: Pequeno, Nome/Email: Largos, Idade: Pequeno)
            float[] columnWidths = {1, 3, 4, 1};
            Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();

            // Adiciona as células de título da tabela (Header)
            table.addHeaderCell("ID");
            table.addHeaderCell("Nome");
            table.addHeaderCell("Email");
            table.addHeaderCell("Idade");

            // PASSO 3: Laço de Repetição para popular o documento com dados do Supabase
            for (Usuario u : repository.findAll()) {
                table.addCell(u.getId().toString());

                // Validações ternárias: Se o campo no banco for nulo, insere "-" para não quebrar o layout do PDF
                table.addCell(u.getNome() != null ? u.getNome() : "-");
                table.addCell(u.getEmail() != null ? u.getEmail() : "-");
                table.addCell(u.getIdade() != null ? u.getIdade().toString() : "-");
            }

            // PASSO 4: Fecha o documento para consolidar as escritas na memória
            document.add(table);
            document.close();

            return out.toByteArray(); // Devolve os bytes prontos do PDF para download
        } catch (Exception e) {
            // Em caso de qualquer erro de IO (falta de memória), lança uma exceção descritiva
            throw new RuntimeException("Erro técnico ao gerar o relatório em PDF", e);
        }
    }
}