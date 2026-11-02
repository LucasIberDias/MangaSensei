package MangaSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import MangaSensei.dto.relatorio.RelatorioResponseDTO;
import MangaSensei.service.RelatorioService;

@RestController
@RequestMapping("/relatorio")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping
    public ResponseEntity<RelatorioResponseDTO> gerarRelatorio(Authentication authentication) {
        RelatorioResponseDTO relatorio = relatorioService.gerarRelatorio(Long.valueOf(authentication.getName()));

        return ResponseEntity.ok(relatorio);
    }
}
