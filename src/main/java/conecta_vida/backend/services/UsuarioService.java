package conecta_vida.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import conecta_vida.backend.models.Usuario;
import conecta_vida.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    //m
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario cadastrarUsuario(Usuario novoUsuario){

        if (usuarioRepository.existsByEmail(novoUsuario.getEmail())){
            // Se já existe, nós "explodimos" um erro que o Controller vai tratar depois
            throw new IllegalArgumentException("Este e-mail já está em uso por outro cidadão.");
        }

        //criptografia da senha
        String senhaCriptografada = passwordEncoder.encode(novoUsuario.getSenha());
        novoUsuario.setSenha(senhaCriptografada);

        
        //salva o usuario no repo
        return usuarioRepository.save(novoUsuario);
    }
    
}
