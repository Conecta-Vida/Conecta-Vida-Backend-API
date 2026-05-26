package br.edu.ifsp.conectaavida.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * ENTIDADE: Comunicacao
 * Tabela na Base de Dados: "comunicacoes"
 * Objetivo: Centralizar os três feeds de dados do sistema ('NOTICIA', 'CAMPANHA' ou 'ALERTA').
 */
@Entity
@Table(name = "comunicacoes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Comunicacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo; // String validadora fundamental: define se a linha é uma 'NOTICIA', 'CAMPANHA' ou 'ALERTA'

    // Relacionamento Opcional: Apenas Notícias ou Campanhas corporativas precisam de estar associadas a um hospital criador
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id")
    private InstituicaoSaude instituicao;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT") // columnDefinition = "TEXT" permite parágrafos longos, quebrando o limite padrão de 255 caracteres
    private String descricao;

    private String categoria;  // Ex: 'Urgente', 'Aviso', 'Vacinação'
    private String linkimagem; // URL de imagens guardadas em storages na cloud
    private String localizacao;// Região ou bairro alvo do comunicado

    @Column(name = "publico_alvo")
    private String publicoAlvo; // Ex: 'Idosos', 'Gestantes', 'População Geral'

    private String status; // Controla se o fluxo está 'Ativa', 'Agendada' ou 'Encerrada'

    private Boolean lido = false; // Flag boleana voltada principalmente para a leitura e encerramento de Alertas Críticos

    @CreationTimestamp
    @Column(name = "data_postada", updatable = false)
    private LocalDateTime dataPostada;

    // Datas cronológicas operadas exclusivamente pelo módulo de Campanhas de Saúde
    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;
}