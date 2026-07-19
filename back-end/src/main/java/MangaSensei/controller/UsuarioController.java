package MangaSensei.controller;

import MangaSensei.model.Usuario;
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

    @PostMapping("/cadastro")
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.criarUsuario(usuario);
    }

    @GetMapping
    public Usuario buscarUsuario(@RequestParam String email){
        return usuarioService.buscarUsuario(email);
    }

    @PutMapping
    public Usuario atualizarUsuario(@PathVariable Integer id ,@RequestBody Usuario usuarioAtualizado){
        return  usuarioService.atualizarUsuario(id, usuarioAtualizado);
    }

    @DeleteMapping
    public void deletarUsuario(@PathVariable Integer id){
        usuarioService.deletarUsuario(id);
    }
}
