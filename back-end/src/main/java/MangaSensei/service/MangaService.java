package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.dto.manga.VolumeMangaResponseDTO;
import MangaSensei.repository.MangaRepository;
import MangaSensei.model.Manga;
import MangaSensei.script.ScraperManga;

import java.util.List;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;
    private final ScraperManga scraperManga;

    public MangaService(MangaRepository mangaRepository,  ScraperManga scraperManga) {
        this.mangaRepository = mangaRepository;
        this.scraperManga = scraperManga;
    }

    // UC06 - Pesquisar Mangá
    public MangaResponseDTO pesquisarManga(MangaRequestDTO request){
        // Verifica se foi passado nenhum titulo
        if (request.getTituloManga().isBlank()) {
            throw new RuntimeException("Nenhum titulo passado para busca");
        }

        // Verifica se nao tem o manga no banco
        if (mangaRepository.findByTituloManga(request.getTituloManga()).isEmpty()) {
            // Chama o Scrapper como nao encontrou nenhum manga
            Manga mangaNovo = scraperManga.buscarManga(request.getTituloManga());

            // Salva o manga novo
            mangaRepository.save(mangaNovo);
        }

        // Pego o manga pesquisado
        Manga mangaPesquisado = mangaRepository.findByTituloManga(request.getTituloManga()).get();

        // Faço a a lista dos volumes do manga ser convertido para VolumeMangaResponse
        List<VolumeMangaResponseDTO> volumes = mangaPesquisado.getVolumes()
            // Permiti processar cada volume da lista
            .stream()
            // Pega cada elemento do manga e transforma em VolumeResponse
            .map(volume -> new VolumeMangaResponseDTO(
                    volume.getIdVolumeManga(),
                    volume.getCapaVolume(),
                    volume.getIsbnVolume()
            ))
            .toList();

        // Agora eu retorno o mangá encontrado, já que ele vai existir no banco mesmo que nao existisse antes
        return new MangaResponseDTO(
            mangaPesquisado.getIdManga(),
            mangaPesquisado.getTituloManga(),
            mangaPesquisado.getAutorManga(),
            mangaPesquisado.getCapaManga(),
            mangaPesquisado.getEditoraManga(),
            mangaPesquisado.getDemografiaManga(),
            mangaPesquisado.getQuantidadeVolumes(),
            volumes
        );
    }
}