package MangaSensei.dto.colecao;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequestDTO {
    private Long idVolumeManga;
    private String estadoVolume;
    private Double valorPago;
    private LocalDate dataCompra;
}
