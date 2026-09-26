package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import MangaSensei.service.ColecaoService;

@RestController
@RequestMapping("/colecao")
public class ColecaoController {

    private final ColecaoService colecaoService;

    public ColecaoController(ColecaoService colecaoService) {
        this.colecaoService = colecaoService;
    }

    @PostMapping
    public ResponseEntity<Void> criarColecao(@RequestParam Long idManga, @RequestParam Long idUsuario) {

        colecaoService.criarColecao(idManga, idUsuario);

        return ResponseEntity.ok().build();
    }
}