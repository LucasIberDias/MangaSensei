package MangaSensei.service;

import MangaSensei.dto.LoginDTO;
import MangaSensei.model.Usuario;
import MangaSensei.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario login(LoginDTO loginDTO){
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(()-> new  RuntimeException("Usuario não encontrado"));

        if (!usuario.getSenha().equals(loginDTO.getSenha())){
            throw new RuntimeException("Senha incorreta");
        }

        return usuario;
    }
}
