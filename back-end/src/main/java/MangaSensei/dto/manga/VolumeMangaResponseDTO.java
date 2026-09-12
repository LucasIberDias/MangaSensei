package MangaSensei.dto.manga;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VolumeMangaResponseDTO{
        Long idVolumeManga;
        String capaVolume;
        String isbnVolume;
}