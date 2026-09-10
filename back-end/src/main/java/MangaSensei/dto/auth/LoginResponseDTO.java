package MangaSensei.dto.auth;

import MangaSensei.dto.usuario.UsuarioResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {
    private UsuarioResponseDTO usuario;
}