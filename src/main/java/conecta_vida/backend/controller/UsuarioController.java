package conecta_vida.backend.controller;

import conecta_vida.backend.models.Usuario;
import conecta_vida.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios") 
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/cadastro") //cadastro pq quando implementar o login, os caminhos da api ficam /cadastro e /login
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) { //<?> pq ele pode retornar Usuario quando um String do erro
        try {
            // Tenta passar o usuário pelo "segurança" (o Service)
            Usuario usuarioSalvo = usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (IllegalArgumentException e) {
            // Sservice barra, ent mandamos o throw q definimos no service
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}