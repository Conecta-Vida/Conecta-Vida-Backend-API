package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Campanha;
import br.edu.ifsp.conectaavida.repository.CampanhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampanhaService {

    @Autowired
    private CampanhaRepository repository;

    public List<Campanha> listarTodas() {
        return repository.findAll();
    }

    public Campanha salvar(Campanha campanha) {
        return repository.save(campanha);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}