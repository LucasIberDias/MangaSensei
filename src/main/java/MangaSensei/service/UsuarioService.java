package MangaSensei.service;

import MangaSensei.model.Usuario;
import MangaSensei.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario criarUsuario(Usuario usuario){
        validarUsuario(usuario);
        tratarDados(usuario);

        return usuarioRepository.save(usuario);
    }

    private void tratarDados(Usuario usuario){
        usuario.setEmail(usuario.getEmail().trim().toLowerCase());

        usuario.setSenha(usuario.getSenha().trim());
    }

    public void validarUsuario(Usuario usuario){
        if (usuarioRepository.existsByEmail(usuario.getEmail())){
            throw  new RuntimeException("E-mail já cadastrado");
        }

        if (usuarioRepository.existsByNome(usuario.getNome())){
            throw new RuntimeException("Nome de usuario já cadastrado");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        usuario.setSenha(usuario.getSenha().trim());

        if (usuario.getSenha().length() < 8) {
            throw new RuntimeException("Senha deve ter no mínimo 8 caracteres");
        }
    }
}
