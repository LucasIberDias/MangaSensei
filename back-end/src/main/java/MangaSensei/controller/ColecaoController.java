package MangaSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.colecao.ColecaoDetalheResponseDTO;
import MangaSensei.dto.colecao.ColecaoResponseDTO;
import MangaSensei.dto.colecao.ItemRequestDTO;
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

    @GetMapping("/{idColecao}")
    public ResponseEntity<ColecaoDetalheResponseDTO> consultarColecao(@PathVariable Long idColecao, Authentication authentication) {
        ColecaoDetalheResponseDTO colecao = colecaoService.consultarColecao(idColecao, Long.valueOf(authentication.getName()));

        return ResponseEntity.ok(colecao);
    }

    @PostMapping("/{idColecao}/volume")
    public ResponseEntity<Void> adicionarVolume(@PathVariable Long idColecao, @RequestBody ItemRequestDTO request, Authentication authentication) {

        colecaoService.adicionarVolume(idColecao, request, Long.valueOf(authentication.getName()));

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public void apagarColecao(@RequestParam Long idColecao, Authentication authentication) {
        colecaoService.apagarColecao(idColecao, Long.valueOf(authentication.getName()));
    }
}
