package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.Vacina;
import br.edu.ifsp.conectaavida.repository.VacinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Indica que esta classe contém a lógica de negócios
public class VacinaService {

    @Autowired
    private VacinaRepository vacinaRepository;

    public List<Vacina> listarTodas() {
        return vacinaRepository.findAll();
    }

    public Optional<Vacina> buscarPorId(Long id) {
        return vacinaRepository.findById(id);
    }

    public Vacina salvar(Vacina vacina) {
        // Aqui no futuro podemos colocar regras, como: "Não permitir vacinas com nomes duplicados"
        return vacinaRepository.save(vacina);
    }

    public void deletar(Long id) {
        vacinaRepository.deleteById(id);
    }
}