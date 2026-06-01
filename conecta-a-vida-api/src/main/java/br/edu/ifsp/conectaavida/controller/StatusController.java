package br.edu.ifsp.conectaavida.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CONTROLADOR DE MONITORAMENTO DE INFRAESTRUTURA (HEALTHCHECK)
 * Explicação para o grupo: Usado essencialmente para validar o critério CR9 (NGINX) e CR10 (JMeter).
 * O balanceador de carga chama essa rota leve e rápida para saber se a instância da API está saudável e online.
 */
@RestController
public class StatusController {

    @GetMapping("/status")
    public String checkStatus() {
        return "🟢 API Unificada Conecta Vida está online, estável e integrada ao Supabase!";
    }
}