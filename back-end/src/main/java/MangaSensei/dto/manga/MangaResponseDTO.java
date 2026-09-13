package MangaSensei.dto.manga;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MangaResponseDTO{
        private Long idManga;
        private String tituloManga;
        private String autorManga;
        private String capaManga;
        private String editoraManga;
        private String demografiaManga;
        private Long quantidadeVolumes;
        private List<VolumeMangaResponseDTO> volumes;
}