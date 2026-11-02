package MangaSensei.dto.relatorio;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RelatorioMangaDTO {
    private Long idColecao;
    private String tituloManga;
    private String autorManga;
    private String editoraManga;
    private String demografiaManga;
    private String capaManga;
    private Long quantidadeVolumes;
    private Long volumesPossuidos;
    private Long volumesFaltando;
    private Integer porcentagem;
    private Long volumesRepetidos;
    private Double valorInvestido;
    private LocalDate ultimaCompra;
    private List<RelatorioVolumeDTO> volumes;
}
