package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.usuario.UsuarioRequestDTO;
import MangaSensei.dto.usuario.UsuarioResponseDTO;
import MangaSensei.dto.usuario.AtualizarSenhaRequestDTO;
import MangaSensei.service.UsuarioService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criarUsuario(@RequestBody UsuarioRequestDTO request) {
        UsuarioResponseDTO response = usuarioService.criarUsuario(request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping
    public ResponseEntity<UsuarioResponseDTO> personalizarPerfil(Authentication authentication, @RequestBody UsuarioRequestDTO request) {
        UsuarioResponseDTO response = usuarioService.personalizarPerfil(Long.valueOf(authentication.getName()), request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/senha")
    public ResponseEntity<Void> atualizarSenha(Authentication authentication, @RequestBody AtualizarSenhaRequestDTO request) {
        usuarioService.atualizarSenha(Long.valueOf(authentication.getName()), request);
        return ResponseEntity.noContent().build();
    }
}
