package MangaSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<Void> criarColecao(@RequestParam Long idManga, Authentication authentication) {

        colecaoService.criarColecao(idManga, Long.valueOf(authentication.getName()));

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<ColecaoResponseDTO>> buscarColecoes(Authentication authentication) {
        List<ColecaoResponseDTO> colecoes = colecaoService.buscarColecoes(Long.valueOf(authentication.getName()));

        return ResponseEntity.ok(colecoes);
    }

    @DeleteMapping
    public void apagarColecao(@RequestParam Long idColecao, Authentication authentication) {
        colecaoService.apagarColecao(idColecao, Long.valueOf(authentication.getName()));
    }
}
