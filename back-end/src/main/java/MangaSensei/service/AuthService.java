package MangaSensei.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import MangaSensei.dto.auth.LoginRequestDTO;
import MangaSensei.dto.auth.LoginResponseDTO;
import MangaSensei.dto.usuario.UsuarioResponseDTO;
import MangaSensei.repository.UsuarioRepository;
import MangaSensei.model.Usuario;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // UC02 - Efetuar login
    public LoginResponseDTO login(LoginRequestDTO request) {

        // Verifica se o email de usuario existe
        if (usuarioRepository.findByEmailUsuario(request.getEmailUsuario()).isEmpty()) {
            throw new RuntimeException("E-mail do usuário não encontrado");
        }

        // Cria o usuario para teste de login atraves do email passado
        Usuario usuario = usuarioRepository.findByEmailUsuario(request.getEmailUsuario()).get();

        // Verifica se a senha passada corresponde a senha do usuario
        if (passwordEncoder.matches(request.getSenhaUsuario(), usuario.getSenhaUsuario()) == false) {
            throw new RuntimeException("Senha não corresponde ao Usuario");
        }

        // Retorna o Usuario apos verificar se a senha ta certa
        return new LoginResponseDTO(
                new UsuarioResponseDTO(
                        usuario.getIdUsuario(),
                        usuario.getNomeUsuario(),
                        usuario.getEmailUsuario(),
                        usuario.getFotoPerfil()));
    }
}