package conecta_vida.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import conecta_vida.backend.models.OrgaoSaude;
import conecta_vida.backend.services.OrgaoSaudeService;


@RestController
@RequestMapping("/api/orgaos")
public class OrgaoSaudeController {
    
    @Autowired
    private OrgaoSaudeService orgaoSaudeService;

    @PostMapping
    public ResponseEntity<?> cadastrarOrgaoSaude(@RequestBody OrgaoSaude orgaoSaude) { //<?> pq ele pode retornar Usuario quando um String do erro
        try {
            //usa service pra testar o orgao antes de criar
            OrgaoSaude orgaoSaudeSalvo = orgaoSaudeService.cadastrarOrgao(orgaoSaude);
            return ResponseEntity.status(HttpStatus.CREATED).body(orgaoSaudeSalvo);
        } catch (IllegalArgumentException e) {
            // Service barra, ent mandamos o throw q definimos no service
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrgaoSaude>> listarOrgaosSaude() {
        return ResponseEntity.ok(orgaoSaudeService.listarTodos());
    }
    
}
