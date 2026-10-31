package MangaSensei.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import MangaSensei.repository.UsuarioRepository;
import MangaSensei.dto.usuario.UsuarioRequestDTO;
import MangaSensei.dto.usuario.UsuarioResponseDTO;
import MangaSensei.dto.usuario.AtualizarSenhaRequestDTO;
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
        usuario.setEmailUsuario(request.getEmailUsuario() == null ? null : request.getEmailUsuario().trim().toLowerCase());
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
        usuario.setFotoPerfil("/images/perfil-padrao.png");

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

    // UC04 - Alterar Dados da Conta
    public UsuarioResponseDTO personalizarPerfil(Long id, UsuarioRequestDTO request) {

        // Verifica pelo Id se o usuario existe
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        // Atualiza apenas o que foi passado pelo usuario
        if (request.getNomeUsuario() != null) {
            String nome = request.getNomeUsuario().trim();
            if (nome.isBlank()) {
                throw new IllegalArgumentException("Nome de usuário está vazio");
            }
            // Verifica se o nome já está sendo usado por outro usuario
            if (usuarioRepository.findByNomeUsuarioAndIdUsuarioNot(nome, id).isPresent()) {
                throw new IllegalArgumentException("Nome de usuário já está cadastrado");
            }
            usuario.setNomeUsuario(nome);
        }
        if (request.getFotoPerfil() != null) {
            if (!request.getFotoPerfil().startsWith("data:image/")) {
                throw new IllegalArgumentException("A foto de perfil deve ser uma imagem válida.");
            }
            if (request.getFotoPerfil().length() > 1_500_000) {
                throw new IllegalArgumentException("A imagem deve ter no máximo 1 MB.");
            }
            usuario.setFotoPerfil(request.getFotoPerfil());
        }
        if (request.getEmailUsuario() != null) {
            String email = request.getEmailUsuario().trim().toLowerCase();
            if (email.isBlank()) {
                throw new IllegalArgumentException("E-mail do usuário está vazio");
            }
            // Verifica se o email já está sendo usado por outro usuario
            if (usuarioRepository.findByEmailUsuarioAndIdUsuarioNot(email, id).isPresent()) {
                throw new IllegalArgumentException("E-mail já está cadastrado");
            }
            usuario.setEmailUsuario(email);
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

    // UC21 - Alterar Senha da Conta
    public void atualizarSenha(Long id, AtualizarSenhaRequestDTO request) {

        // Verifica pelo Id se o usuario existe
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario não encontrado"));

        // Verifica se a senha antiga informada está correta
        if (request.getSenhaAtual() == null || !passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenhaUsuario())) {
            throw new IllegalArgumentException("A senha atual está incorreta");
        }

        // Valida o tamanho da nova senha
        if (request.getNovaSenha() == null || request.getNovaSenha().length() < 8) {
            throw new IllegalArgumentException("A senha deve possuir no mínimo 8 caracteres");
        }

        // Transforma a nova senha em hash depois de validar
        usuario.setSenhaUsuario(passwordEncoder.encode(request.getNovaSenha()));

        // Salva no banco de dados
        usuarioRepository.save(usuario);
    }
}
