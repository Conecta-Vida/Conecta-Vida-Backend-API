package conecta_vida.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import conecta_vida.backend.models.OrgaoSaude;
import conecta_vida.backend.repository.OrgaoSaudeRepository;

@Service
public class OrgaoSaudeService {

    @Autowired
    private OrgaoSaudeRepository orgaoSaudeRepository;

    public OrgaoSaude cadastrarOrgao(OrgaoSaude orgao) {
        // Regra pra garantir nome não nulo
        if (orgao.getNome() == null || orgao.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do Órgão de Saúde é obrigatório.");
        }
        
        return orgaoSaudeRepository.save(orgao);
    }

    // Metodo basico pra listar todos os orgãos de saúde
    public List<OrgaoSaude> listarTodos() {
        return orgaoSaudeRepository.findAll();
    }
    
}
