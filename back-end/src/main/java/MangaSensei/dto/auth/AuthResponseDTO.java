package MangaSensei.dto.auth;

import MangaSensei.dto.usuario.UsuarioResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private UsuarioResponseDTO usuario;
}
