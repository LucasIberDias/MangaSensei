package MangaSensei.dto.relatorio;

import java.time.LocalDate;

import MangaSensei.model.EstadoVolume;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RelatorioVolumeDTO {
    private Integer numeroVolume;
    private String isbnVolume;
    private EstadoVolume estadoVolume;
    private Double valorPago;
    private LocalDate dataCompra;
    private Integer quantidade;
}
