package MangaSensei.dto.manga;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MangaRequestDTO{
        String tituloManga;
        String autorManga;
        String capaManga;
        String editoraManga;
        String demografiaManga;
        List<VolumeMangaRequestDTO> volumes;
}