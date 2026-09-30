package MangaSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.colecao.ColecaoResponseDTO;
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

    @GetMapping
    public ResponseEntity<List<ColecaoResponseDTO>> buscarColecoes(@RequestParam Long idUsuario) {
        List<ColecaoResponseDTO> colecoes = colecaoService.buscarColecoes(idUsuario);

        return ResponseEntity.ok(colecoes);
    }

    @DeleteMapping
    public void apagarColecao(@RequestParam Long idColecao) {
        colecaoService.apagarColecao(idColecao);
    }
}