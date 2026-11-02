package MangaSensei.dto.relatorio;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RelatorioResponseDTO {
    private Long totalObras;
    private Long obrasCompletas;
    private Long obrasEmAndamento;
    private Long obrasNaoIniciadas;
    private Long volumesPossuidos;
    private Long volumesFaltando;
    private Long volumesRepetidos;
    private Double valorTotal;
    private Double valorMedioVolume;
    private Integer progressoGeral;
    private List<RelatorioMangaDTO> mangas;
}
