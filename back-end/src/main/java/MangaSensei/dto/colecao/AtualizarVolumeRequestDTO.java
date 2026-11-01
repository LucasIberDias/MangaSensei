package MangaSensei.dto.colecao;

import java.time.LocalDate;

import MangaSensei.model.EstadoVolume;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarVolumeRequestDTO {
    private EstadoVolume estadoVolume;
    private Double valorPago;
    private LocalDate dataCompra;
}
