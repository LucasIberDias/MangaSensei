package MangaSensei.dto.usuario;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {
    private String nomeUsuario;
    private String emailUsuario;
    private String senhaUsuario;
    private String fotoPerfil;
}