package MangaSensei.dto.colecao;

import java.time.LocalDate;

import MangaSensei.model.EstadoVolume;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VolumeColecaoResponseDTO {
    private Integer numeroVolume;
    private Long idVolumeManga;
    private String capaVolume;
    private String isbnVolume;
    private Boolean possuido;
    private Long idItem;
    private EstadoVolume estadoVolume;
    private Double valorPago;
    private LocalDate dataCompra;
    private Integer quantidade;
}
