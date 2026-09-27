package MangaSensei.dto.colecao;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ColecaoResponseDTO {
    private Long idColecao;
    private Long idManga;
    private String tituloManga;
    private String autorManga;
    private String capaManga;
    private String demografiaManga;
    private Long quantidadeVolumes;
    private Long volumesPossuidos;
    private Integer porcentagem;
}