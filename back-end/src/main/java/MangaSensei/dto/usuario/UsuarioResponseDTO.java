package MangaSensei.dto.usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UsuarioResponseDTO {
    private Long idUsuario;
    private String nomeUsuario;
    private String emailUsuario;
    private String fotoPerfil;
}