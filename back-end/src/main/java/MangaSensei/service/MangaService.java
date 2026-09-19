package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.dto.manga.VolumeMangaResponseDTO;
import MangaSensei.repository.MangaRepository;
import MangaSensei.model.Manga;
import MangaSensei.script.ScraperManga;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;
    private final ScraperManga scraperManga;

    public MangaService(MangaRepository mangaRepository, ScraperManga scraperManga) {
        this.mangaRepository = mangaRepository;
        this.scraperManga = scraperManga;
    }

    // UC06 - Pesquisar Mangá
    public MangaResponseDTO pesquisarManga(MangaRequestDTO request) {
        // Verifica se foi passado nenhum titulo
        if (request.getTituloManga().isBlank()) {
            throw new RuntimeException("Nenhum titulo passado para busca");
        }

        // Crio um objeto para salvar depois o manga pesquisado
        Manga mangaPesquisado;

        // Verifica se já existe um manga com esse nome ou nome parecido no banco
        if (mangaRepository.findByTituloMangaContainingIgnoreCase(request.getTituloManga()).isEmpty()) {
            // Se não encontrou, chama o scraper
            Manga mangaNovo = scraperManga.buscarManga(request.getTituloManga());
            // Salva o manga encontrado pelo scraper
            mangaPesquisado = mangaRepository.save(mangaNovo);
        } else {
            // Se encontrou, pega o manga existente
            mangaPesquisado = mangaRepository.findByTituloMangaContainingIgnoreCase(request.getTituloManga()).get();
        }

        // Faço a a lista dos volumes do manga ser convertido para VolumeMangaResponse
        List<VolumeMangaResponseDTO> volumes = mangaPesquisado.getVolumes()
                // Permiti processar cada volume da lista
                .stream()
                // Pega cada elemento do manga e transforma em VolumeResponse
                .map(volume -> new VolumeMangaResponseDTO(
                        volume.getIdVolumeManga(),
                        volume.getCapaVolume(),
                        volume.getIsbnVolume()))
                .toList();

        // Agora eu retorno o mangá encontrado, já que ele vai existir no banco mesmo
        // que nao existisse antes
        return new MangaResponseDTO(
                mangaPesquisado.getIdManga(),
                mangaPesquisado.getTituloManga(),
                mangaPesquisado.getAutorManga(),
                mangaPesquisado.getCapaManga(),
                mangaPesquisado.getEditoraManga(),
                mangaPesquisado.getDemografiaManga(),
                mangaPesquisado.getQuantidadeVolumes(),
                volumes);
    }

    // UC07 - Apresentar por Demografia
    public Map<String, List<Manga>> apresentarPorDemografia() {
        // Faço uma lista com todas as demografias dinstintas do banco
         List<String> demografias = mangaRepository.findDistinctDemografiaManga();

        // Crio um map que será preenchido com a Demografia e uma lista de 5 mangás da
        // mesma demografia
        Map<String, List<Manga>> resultado = new HashMap<>();

        // Preencho a map com a demografia e a lista de mangás
        for (String demografia : demografias) {
            // Coloco os dados dentro da map
            resultado.put(demografia, buscarMangasPorDemografia(demografia));
        }

        // Retorno a map com as demografias e os mangás
        return resultado;
    }

    // Função de buscar mangas por demografia para que o apresentar possa chamar e
    // fazer uma lista de mangás para cada demografia
    public List<Manga> buscarMangasPorDemografia(String demografia) {
        // Faço uma lista com todos os mangás de uma determinada demografia
        List<Manga> mangas = mangaRepository.findByDemografiaMangaContainingIgnoreCase(demografia);

        // Mistura a ordem da lista com Collections
        Collections.shuffle(mangas);

        // Retorno 5 mangás da lista
        return mangas.stream().limit(5).toList();
    }

}