package MangaSensei.dto.dashboard;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponseDTO {
    private Long volumesNaColecao;
    private Long obrasDiferentes;
    private Double valorTotal;
    private Long obrasCompletas;
    private List<ItemGraficoDTO> estadoColecao;
    private Long investimentoAte25;
    private Long investimento25a50;
    private Long investimentoAcima50;
    private List<UltimoAdicionadoDTO> ultimosAdicionados;
    private List<ItemGraficoDTO> principaisDemografias;
}
