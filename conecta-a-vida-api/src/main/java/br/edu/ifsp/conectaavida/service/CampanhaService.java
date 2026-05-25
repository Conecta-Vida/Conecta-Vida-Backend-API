package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Comunicacao;
import br.edu.ifsp.conectaavida.repository.ComunicacaoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CampanhaService {

    private final ComunicacaoRepository repository;

    public CampanhaService(ComunicacaoRepository repository) { this.repository = repository; }

    public List<Comunicacao> listarTodas() {
        return repository.findByTipo("CAMPANHA");
    }

    public Comunicacao salvar(Comunicacao campanha) {
        campanha.setTipo("CAMPANHA"); // Garante a classificação correta no banco
        return repository.save(campanha);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}