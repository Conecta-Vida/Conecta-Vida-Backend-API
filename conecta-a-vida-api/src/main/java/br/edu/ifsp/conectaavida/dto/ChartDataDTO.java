package br.edu.ifsp.conectaavida.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// O @Data (do Lombok) cria os Getters, Setters, equals e hashCode automaticamente.
// O @AllArgsConstructor cria um construtor que exige o 'mes' e a 'quantidade'.
@Data
@AllArgsConstructor
public class ChartDataDTO {
    private String mes;
    private long quantidade;
}