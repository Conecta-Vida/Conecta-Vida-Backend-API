package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Campanha;
import br.edu.ifsp.conectaavida.repository.CampanhaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service // Registra a classe no Spring para podermos injetá-la depois.
public class CampanhaService {

    private final CampanhaRepository repository;

    // Boa Prática: Injeção de dependência via Construtor.
    public CampanhaService(CampanhaRepository repository) { this.repository = repository; }

    public List<Campanha> listarTodas() { return repository.findAll(); }
    public Campanha salvar(Campanha campanha) { return repository.save(campanha); }
    public void deletar(Long id) { repository.deleteById(id); }
}