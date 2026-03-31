package br.edu.ifsp.conectaavida.service;

import br.edu.ifsp.conectaavida.domain.RegistroVacinacao;
import br.edu.ifsp.conectaavida.repository.RegistroVacinacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroVacinacaoService {

    @Autowired
    private RegistroVacinacaoRepository repository;

    public RegistroVacinacao registrarAplicacao(RegistroVacinacao registro) {
        return repository.save(registro);
    }

    public List<RegistroVacinacao> buscarCarteiraDoPaciente(Long pacienteId) {
        // Chamada atualizada para findByPaciente_Id
        return repository.findByPaciente_Id(pacienteId);
    }
}