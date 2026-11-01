package MangaSensei.dto.dashboard;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UltimoAdicionadoDTO {
    private Long idColecao;
    private String tituloManga;
    private String capa;
    private Integer numeroVolume;
    private LocalDate dataAdicao;
}
