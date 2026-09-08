package MangaSensei.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    private String emailUsuario;
    private String senhaUsuario;
}