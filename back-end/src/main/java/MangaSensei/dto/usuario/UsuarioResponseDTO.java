package MangaSensei.dto.usuario;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioResponseDTO {
    private Long idUsuario;
    private String nomeUsuario;
    private String emailUsuario;
    private String fotoPerfil;
}