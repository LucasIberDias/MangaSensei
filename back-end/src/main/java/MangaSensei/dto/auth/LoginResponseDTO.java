package MangaSensei.dto.auth;

import MangaSensei.dto.usuario.UsuarioResponseDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private UsuarioResponseDTO usuario;
}