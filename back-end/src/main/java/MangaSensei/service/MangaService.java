package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.dto.manga.VolumeMangaResponseDTO;
import MangaSensei.repository.MangaRepository;
import MangaSensei.model.Manga;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    // UC06 - Pesquisar Mangá
    public MangaResponseDTO pesquisarManga(MangaRequestDTO request){
        
    }
}