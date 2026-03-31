package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Paciente;
import br.edu.ifsp.conectaavida.repository.PacienteRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class RelatorioService {

    @Autowired
    private PacienteRepository repository;

    public byte[] gerarRelatorioPacientes() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Relatório de Pacientes - Conecta à Vida").setFontSize(18).setBold());
            document.add(new Paragraph("Documento gerado em: " + java.time.LocalDateTime.now()));
            document.add(new Paragraph("\n"));

            float[] columnWidths = {1, 4, 3, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();
            table.addHeaderCell("ID");
            table.addHeaderCell("Nome");
            table.addHeaderCell("CPF");
            table.addHeaderCell("Sangue");

            List<Paciente> lista = repository.findAll();
            for (Paciente p : lista) {
                table.addCell(p.getId().toString());
                table.addCell(p.getNome());
                table.addCell(p.getCpf());
                table.addCell(p.getTipagemSanguinea() != null ? p.getTipagemSanguinea() : "-");
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return out.toByteArray();
    }
}