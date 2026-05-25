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

@Service
public class RelatorioService {

    private final UsuarioRepository repository;
    public RelatorioService(UsuarioRepository repository) { this.repository = repository; }

    public byte[] gerarRelatorioUsuarios() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Relatório de Usuários - Conecta à Vida").setFontSize(18).setBold());
            document.add(new Paragraph("Documento gerado em: " + java.time.LocalDateTime.now() + "\n"));

            float[] columnWidths = {1, 3, 4, 1};
            Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();
            table.addHeaderCell("ID"); table.addHeaderCell("Nome");
            table.addHeaderCell("Email"); table.addHeaderCell("Idade");

            for (Usuario u : repository.findAll()) {
                table.addCell(u.getId().toString());
                table.addCell(u.getNome() != null ? u.getNome() : "-");
                table.addCell(u.getEmail() != null ? u.getEmail() : "-");
                table.addCell(u.getIdade() != null ? u.getIdade().toString() : "-");
            }
            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar o relatório em PDF", e);
        }
    }
}