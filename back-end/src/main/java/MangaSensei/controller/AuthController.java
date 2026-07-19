package MangaSensei.controller;

import MangaSensei.dto.LoginDTO;
import MangaSensei.model.Usuario;
import MangaSensei.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginDTO loginDTO) {

        Usuario usuario = authService.login(loginDTO);

        return ResponseEntity.ok(usuario);
    }

}