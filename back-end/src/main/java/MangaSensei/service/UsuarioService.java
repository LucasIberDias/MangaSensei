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
        usuario.setSenhaUsuario(request.getSenhaUsuario());

        // Validacao das informacoes passadas:
        // Validacoes de nada vazio
        if (usuario.getNomeUsuario() == null || usuario.getNomeUsuario().isBlank()) {
            throw new RuntimeException("Nome de usuário está vazio");
        }

        if (usuario.getEmailUsuario() == null || usuario.getEmailUsuario().isBlank()) {
            throw new RuntimeException("E-mail do usuário está vazio");
        }

        // Validacoes de tamanho
        if (usuario.getSenhaUsuario() == null || usuario.getSenhaUsuario().length() < 8) {
            throw new RuntimeException("A senha deve possuir no mínimo 8 caracteres");
        }

        // Validacoes de nada repetido
        if (usuarioRepository.findByNomeUsuario(usuario.getNomeUsuario()).isPresent()) {
            throw new RuntimeException("Nome de usuário já está cadastrado");
        }

        if (usuarioRepository.findByEmailUsuario(usuario.getEmailUsuario()).isPresent()) {
            throw new RuntimeException("E-mail já está cadastrado");
        }

        // Transforma senha em hash depois de validar o tamanho
        usuario.setSenhaUsuario(passwordEncoder.encode(request.getSenhaUsuario()));

        // Definea foto de perfil padrão
        usuario.setFotoPerfil("src/main/resources/static/images/perfil-padrao.png");

        // Salva no banco de dados
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // Retorna apenas os dados que podem ser expostos
        return new UsuarioResponseDTO(
            usuarioSalvo.getIdUsuario(),
            usuarioSalvo.getNomeUsuario(),
            usuarioSalvo.getEmailUsuario(),
            usuarioSalvo.getFotoPerfil()
        );
    }

    // UC03 - Personalizar Perfil
    public UsuarioResponseDTO personalizarPerfil(Long id, UsuarioRequestDTO request) {

        // Verifica pelo Id se o usuario existe
        if (usuarioRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Usuario não encontrado");
        }

        // Coleta o usuario
        Usuario usuario = usuarioRepository.findById(id).get();

        // Atualiza apenas o que foi passado pelo usuario
        if (request.getNomeUsuario() != null) {
            usuario.setNomeUsuario(request.getNomeUsuario());
        }
        if (request.getFotoPerfil() != null) {
            usuario.setFotoPerfil(request.getFotoPerfil());
        }
        if (request.getEmailUsuario() != null) {
            usuario.setEmailUsuario(request.getEmailUsuario());
        }
        if (request.getSenhaUsuario() != null) {
            usuario.setSenhaUsuario(passwordEncoder.encode(request.getSenhaUsuario()));
        }

        // Salva no banco de dados
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(
            usuarioSalvo.getIdUsuario(),
            usuarioSalvo.getNomeUsuario(),
            usuarioSalvo.getEmailUsuario(),
            usuarioSalvo.getFotoPerfil()
        );
    }
}