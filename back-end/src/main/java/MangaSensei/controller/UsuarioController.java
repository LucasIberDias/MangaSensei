package MangaSensei.controller;

import MangaSensei.model.Usuario;
import MangaSensei.repository.UsuarioRepository;
import MangaSensei.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.criarUsuario(usuario);
    }

    @GetMapping
    public Usuario buscarUsuario(@RequestParam String email){
        return usuarioService.buscarUsuario(email);
    }
}
