package MangaSensei.dto.manga;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MangaResponseDTO{
        Long idManga;
        String tituloManga;
        String autorManga;
        String capaManga;
        String editoraManga;
        String demografiaManga;
        Long quantidadeVolumes;
        List<VolumeMangaResponseDTO> volumes;
}