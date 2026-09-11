package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.auth.LoginRequestDTO;
import MangaSensei.dto.usuario.UsuarioResponseDTO;
import MangaSensei.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        UsuarioResponseDTO response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}