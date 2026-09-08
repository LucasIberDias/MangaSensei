package MangaSensei.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import MangaSensei.repository.UsuarioRepository;
import MangaSensei.dto.usuario.UsuarioRequestDTO;
import MangaSensei.dto.usuario.UsuarioResponseDTO;
import MangaSensei.model.Usuario;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // UC01 - Cadastrar Usuario
    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO request) {

        // Criacao do usuario que será preenchido.
        Usuario usuario = new Usuario();

        // Coleta das informacoes para criar o usuario
        usuario.setNomeUsuario(request.getNomeUsuario());
        usuario.setEmailUsuario(request.getEmailUsuario());

        // Coleta a senha e transforma em hash
        usuario.setSenhaUsuario(passwordEncoder.encode(request.getSenhaUsuario()));

        // Validacao das informacoes passadas

        // Salva o usuario criado caso nao tenho nenhuum erro
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // Retorna apenas os dados que podem ser expostos
        return new UsuarioResponseDTO(
                usuarioSalvo.getIdUsuario(),
                usuarioSalvo.getNomeUsuario(),
                usuarioSalvo.getEmailUsuario(),
                usuarioSalvo.getFotoPerfil()
        );
    }
}