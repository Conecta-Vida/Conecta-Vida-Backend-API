package br.edu.ifsp.conectaavida.controller;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLADOR REST: CENTRAL DE GESTÃO DE ALERTAS CRÍTICOS (CRUD COMPLETO)
 * * Explicação para o grupo (Luiz, Gustavo, Gabriel, Renan e Maycon):
 * Este controlador foi expandido para suportar o ciclo de vida completo de um Alerta.
 * Agora ele é capaz de Listar ativos, Marcar como lido, Editar dados técnicos e Deletar registros.
 */
@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*") // Permite que o React faça requisições sem bloqueios de segurança local
public class AlertaController {

    @Autowired
    private ComunicacaoRepository repository;

    /**
     * OPERAÇÃO 1: BUSCAR ALERTAS ATIVOS (READ)
     * Rota: GET http://localhost:8080/api/alertas/ativos
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<Comunicacao>> obterAlertasAtivos() {
        // Busca automática no banco usando a regra: tipo == 'ALERTA' e lido == false
        List<Comunicacao> alertasAtivos = repository.findByTipoAndLidoFalseOrderByDataPostadaDesc("ALERTA");
        return ResponseEntity.ok(alertasAtivos);
    }

    /**
     * OPERAÇÃO 2: RECONHECER / ARQUIVAR ALERTA (UPDATE STATUS)
     * Rota: PUT http://localhost:8080/api/alertas/{id}/ler
     */
    @PutMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLido(@PathVariable Long id) {
        return repository.findById(id).map(alerta -> {
            alerta.setLido(true); // Oculta da central de monitoramento, mas mantém o histórico
            repository.save(alerta);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * OPERAÇÃO 3: MODIFICAR TEXTO/CAMPOS DO ALERTA (UPDATE TEXT - NOVIDADE)
     * Rota: PUT http://localhost:8080/api/alertas/{id}
     * * Explicação para o grupo: Quando o gestor altera o título ou descrição do alerta
     * no modal do React, esta rota localiza o registro original e aplica as novas strings.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAlerta(@PathVariable Long id, @RequestBody Comunicacao novosDados) {
        return repository.findById(id).map(alerta -> {
            // Atualiza os campos mantendo o tipo polimórfico original como 'ALERTA'
            alerta.setTitulo(novosDados.getTitulo());
            alerta.setDescricao(novosDados.getDescricao());
            alerta.setCategoria(novosDados.getCategoria());
            alerta.setLocalizacao(novosDados.getLocalizacao());

            Comunicacao atualizado = repository.save(alerta); // Grava as alterações no Supabase
            return ResponseEntity.ok(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * OPERAÇÃO 4: EXCLUIR ALERTA DEFINITIVAMENTE (DELETE - NOVIDADE)
     * Rota: DELETE http://localhost:8080/api/alertas/{id}
     * * Explicação para o grupo: Remove fisicamente a linha correspondente ao ID de dentro
     * da tabela "public.comunicacoes" no Supabase.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAlerta(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build(); // Retorna 404 caso o ID não exista
        }
        repository.deleteById(id); // Deleta do banco de dados
        return ResponseEntity.noContent().build(); // Retorna HTTP 244 (Sucesso sem conteúdo)
    }
}