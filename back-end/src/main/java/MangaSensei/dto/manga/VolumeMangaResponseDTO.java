package MangaSensei.dto.manga;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VolumeMangaResponseDTO{
        private Long idVolumeManga;
        private String capaVolume;
        private String isbnVolume;
}