package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.manga.MangaRequestDTO;
import MangaSensei.dto.manga.MangaResponseDTO;
import MangaSensei.model.Manga;
import MangaSensei.service.MangaService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manga")
public class MangaController {

    private final MangaService mangaService;

    public MangaController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    @GetMapping
    public ResponseEntity<MangaResponseDTO> pesquisarManga(@RequestParam String titulo) {
        MangaRequestDTO request = new MangaRequestDTO();

        request.setTituloManga(titulo);

        MangaResponseDTO response = mangaService.pesquisarManga(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/demografia")
    public ResponseEntity<Map<String, List<Manga>>> apresentarPorDemografia() {

        Map<String, List<Manga>> response = mangaService.apresentarPorDemografia();

        return ResponseEntity.ok(response);
    }
}