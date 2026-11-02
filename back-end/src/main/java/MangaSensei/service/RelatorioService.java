package MangaSensei.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MangaSensei.dto.relatorio.RelatorioMangaDTO;
import MangaSensei.dto.relatorio.RelatorioResponseDTO;
import MangaSensei.dto.relatorio.RelatorioVolumeDTO;
import MangaSensei.model.Colecao;
import MangaSensei.model.Item;
import MangaSensei.model.Manga;
import MangaSensei.model.VolumeManga;
import MangaSensei.repository.ColecaoRepository;
import MangaSensei.repository.ItemRepository;

@Service
public class RelatorioService {
    private final ColecaoRepository colecaoRepository;
    private final ItemRepository itemRepository;

    public RelatorioService(ColecaoRepository colecaoRepository, ItemRepository itemRepository) {
        this.colecaoRepository = colecaoRepository;
        this.itemRepository = itemRepository;
    }

    // UC19 - Gerar Relatório em Tela
    @Transactional(readOnly = true)
    public RelatorioResponseDTO gerarRelatorio(Long idUsuario) {
        // Pego todas as coleções e todos os volumes que o usuario possui
        List<Colecao> colecoes = colecaoRepository.findByUsuarioIdUsuario(idUsuario);
        List<Item> itens = itemRepository.findByColecao_Usuario_IdUsuario(idUsuario);

        // Separo os volumes possuidos por coleção, assim monto cada mangá do relatório
        Map<Long, List<Item>> itensPorColecao = itens.stream()
                .collect(Collectors.groupingBy(item -> item.getColecao().getIdColecao()));

        // Monto a lista com todos os mangás, em ordem alfabética
        List<RelatorioMangaDTO> mangas = colecoes.stream()
                .map(colecao -> montarManga(colecao, itensPorColecao.getOrDefault(colecao.getIdColecao(), List.of())))
                .sorted(Comparator.comparing(RelatorioMangaDTO::getTituloManga, String.CASE_INSENSITIVE_ORDER))
                .toList();

        // Conto as obras completas, em andamento e não iniciadas
        long obrasCompletas = mangas.stream()
                .filter(manga -> manga.getQuantidadeVolumes() > 0 && manga.getVolumesFaltando() == 0)
                .count();
        long obrasNaoIniciadas = mangas.stream()
                .filter(manga -> manga.getVolumesPossuidos() == 0)
                .count();
        long obrasEmAndamento = mangas.size() - obrasCompletas - obrasNaoIniciadas;

        // Somo os volumes de todos os mangás
        long volumesPossuidos = mangas.stream().mapToLong(RelatorioMangaDTO::getVolumesPossuidos).sum();
        long volumesFaltando = mangas.stream().mapToLong(RelatorioMangaDTO::getVolumesFaltando).sum();
        long volumesRepetidos = mangas.stream().mapToLong(RelatorioMangaDTO::getVolumesRepetidos).sum();
        long volumesTotais = mangas.stream().mapToLong(RelatorioMangaDTO::getQuantidadeVolumes).sum();

        // Somo o valor pago e calculo a média só com os volumes que tem valor informado
        List<Double> valores = itens.stream()
                .map(Item::getValorPago)
                .filter(Objects::nonNull)
                .toList();
        double valorTotal = valores.stream().mapToDouble(Double::doubleValue).sum();
        double valorMedioVolume = valores.isEmpty() ? 0 : valorTotal / valores.size();

        // Calculo a porcentagem de toda a coleção
        int progressoGeral = volumesTotais > 0 ? (int) ((volumesPossuidos * 100) / volumesTotais) : 0;

        return new RelatorioResponseDTO(
                (long) mangas.size(),
                obrasCompletas,
                obrasEmAndamento,
                obrasNaoIniciadas,
                volumesPossuidos,
                volumesFaltando,
                volumesRepetidos,
                valorTotal,
                valorMedioVolume,
                progressoGeral,
                mangas);
    }

    // Monto as informações de um mangá da coleção com os volumes que o usuario possui
    private RelatorioMangaDTO montarManga(Colecao colecao, List<Item> itens) {
        Manga manga = colecao.getManga();

        // Descubro o número de cada volume pela ordem em que foram cadastrados, igual na consulta da coleção
        List<VolumeManga> volumesManga = manga.getVolumes().stream()
                .sorted(Comparator.comparing(VolumeManga::getIdVolumeManga))
                .toList();
        Map<Long, Integer> numeroPorVolume = new HashMap<>();
        for (int i = 0; i < volumesManga.size(); i++) {
            numeroPorVolume.put(volumesManga.get(i).getIdVolumeManga(), i + 1);
        }

        // Monto a lista dos volumes possuidos, do primeiro para o último
        List<RelatorioVolumeDTO> volumes = new ArrayList<>();
        for (Item item : itens) {
            volumes.add(new RelatorioVolumeDTO(
                    numeroPorVolume.getOrDefault(item.getVolume().getIdVolumeManga(), 0),
                    item.getVolume().getIsbnVolume(),
                    item.getEstadoVolume(),
                    item.getValorPago(),
                    item.getDataCompra(),
                    item.getQuantidade()));
        }
        volumes.sort(Comparator.comparing(RelatorioVolumeDTO::getNumeroVolume));

        // Calculo os números do mangá
        long quantidadeVolumes = manga.getQuantidadeVolumes() != null ? manga.getQuantidadeVolumes() : 0;
        long volumesPossuidos = itens.size();
        long volumesFaltando = Math.max(0, quantidadeVolumes - volumesPossuidos);
        int porcentagem = quantidadeVolumes > 0 ? (int) ((volumesPossuidos * 100) / quantidadeVolumes) : 0;

        // Cada cópia a mais de um volume conta como repetido
        long volumesRepetidos = itens.stream()
                .mapToLong(item -> item.getQuantidade() != null ? item.getQuantidade() - 1 : 0)
                .sum();

        // Somo o valor pago nos volumes desse mangá
        double valorInvestido = itens.stream()
                .map(Item::getValorPago)
                .filter(Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .sum();

        // Pego a data da compra mais recente
        LocalDate ultimaCompra = itens.stream()
                .map(Item::getDataCompra)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null);

        return new RelatorioMangaDTO(
                colecao.getIdColecao(),
                manga.getTituloManga(),
                manga.getAutorManga(),
                manga.getEditoraManga(),
                manga.getDemografiaManga(),
                manga.getCapaManga(),
                quantidadeVolumes,
                volumesPossuidos,
                volumesFaltando,
                porcentagem,
                volumesRepetidos,
                valorInvestido,
                ultimaCompra,
                volumes);
    }
}
