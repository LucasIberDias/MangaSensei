package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.repository.MangaRepository;
import MangaSensei.model.Manga;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

}