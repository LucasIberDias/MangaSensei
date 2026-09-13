package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.dto.manga.VolumeMangaResponseDTO;
import MangaSensei.repository.MangaRepository;
import MangaSensei.model.Manga;

import MangaSensei.script.*;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
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
            buscar_manga();
        }
    }
}