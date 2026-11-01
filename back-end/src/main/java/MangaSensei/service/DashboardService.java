package MangaSensei.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MangaSensei.dto.dashboard.DashboardResponseDTO;
import MangaSensei.dto.dashboard.ItemGraficoDTO;
import MangaSensei.dto.dashboard.UltimoAdicionadoDTO;
import MangaSensei.model.Colecao;
import MangaSensei.model.Item;
import MangaSensei.model.Manga;
import MangaSensei.model.VolumeManga;
import MangaSensei.repository.ColecaoRepository;
import MangaSensei.repository.ItemRepository;

@Service
public class DashboardService {
    // Estados que o usuario pode escolher para o volume, na ordem em que aparecem no gráfico
    private static final List<String> ESTADOS_VOLUME = List.of("Novo", "Seminovo", "Usado", "Danificado");

    // Quantidade de mangás enviados para os últimos adicionados, o front mostra quantos couberem na tela
    private static final int QUANTIDADE_ULTIMOS = 12;

    // Quantidade de demografias que aparecem nos principais gêneros
    private static final int QUANTIDADE_DEMOGRAFIAS = 5;

    private final ColecaoRepository colecaoRepository;
    private final ItemRepository itemRepository;

    public DashboardService(ColecaoRepository colecaoRepository, ItemRepository itemRepository) {
        this.colecaoRepository = colecaoRepository;
        this.itemRepository = itemRepository;
    }

    // UC16 - Apresentar Dashboard
    @Transactional(readOnly = true)
    public DashboardResponseDTO apresentarDashboard(Long idUsuario) {
        // Pego todas as coleções e todos os volumes que o usuario possui
        List<Colecao> colecoes = colecaoRepository.findByUsuarioIdUsuario(idUsuario);
        List<Item> itens = itemRepository.findByColecao_Usuario_IdUsuario(idUsuario);

        // Quantidade de volumes na coleção e de obras diferentes
        long volumesNaColecao = itens.size();
        long obrasDiferentes = colecoes.size();

        // Somo o valor pago de todos os volumes, os que não tem valor informado não entram na conta
        double valorTotal = itens.stream()
                .filter(item -> item.getValorPago() != null)
                .mapToDouble(Item::getValorPago)
                .sum();

        // Conto quantos volumes o usuario tem de cada coleção para saber quais estão completas
        Map<Long, Long> volumesPorColecao = itens.stream()
                .collect(Collectors.groupingBy(item -> item.getColecao().getIdColecao(), Collectors.counting()));

        long obrasCompletas = colecoes.stream()
                .filter(colecao -> {
                    Long quantidadeVolumes = colecao.getManga().getQuantidadeVolumes();
                    long possuidos = volumesPorColecao.getOrDefault(colecao.getIdColecao(), 0L);
                    return quantidadeVolumes != null && quantidadeVolumes > 0 && possuidos >= quantidadeVolumes;
                })
                .count();

        return new DashboardResponseDTO(
                volumesNaColecao,
                obrasDiferentes,
                valorTotal,
                obrasCompletas,
                montarEstadoColecao(itens),
                contarFaixa(itens, 0, 25),
                contarFaixa(itens, 25, 50),
                contarFaixa(itens, 50, Double.MAX_VALUE),
                montarUltimosAdicionados(itens),
                montarPrincipaisDemografias(itens));
    }

    // Conto quantos volumes existem em cada estado (Novo, Seminovo, Usado, Danificado)
    private List<ItemGraficoDTO> montarEstadoColecao(List<Item> itens) {
        // Começo com todos os estados zerados, assim eles sempre aparecem no gráfico
        Map<String, Long> contagem = new LinkedHashMap<>();
        ESTADOS_VOLUME.forEach(estado -> contagem.put(estado, 0L));

        for (Item item : itens) {
            if (item.getEstadoVolume() != null) {
                contagem.merge(item.getEstadoVolume(), 1L, Long::sum);
            }
        }

        return contagem.entrySet().stream()
                .map(entrada -> new ItemGraficoDTO(entrada.getKey(), entrada.getValue()))
                .toList();
    }

    // Conto quantos volumes tem o valor pago dentro da faixa (maior que o minimo e até o maximo)
    private long contarFaixa(List<Item> itens, double minimo, double maximo) {
        return itens.stream()
                .filter(item -> item.getValorPago() != null)
                .filter(item -> {
                    double valor = item.getValorPago();
                    // A primeira faixa também inclui os volumes de R$ 0
                    boolean acimaDoMinimo = minimo == 0 ? valor >= 0 : valor > minimo;
                    return acimaDoMinimo && valor <= maximo;
                })
                .count();
    }

    // Pego os últimos volumes adicionados na coleção, do mais novo para o mais antigo
    private List<UltimoAdicionadoDTO> montarUltimosAdicionados(List<Item> itens) {
        List<UltimoAdicionadoDTO> ultimos = new ArrayList<>();

        List<Item> itensRecentes = itens.stream()
                .sorted(Comparator.comparing(Item::getIdItem).reversed())
                .limit(QUANTIDADE_ULTIMOS)
                .toList();

        for (Item item : itensRecentes) {
            Manga manga = item.getColecao().getManga();
            VolumeManga volume = item.getVolume();

            // Descubro o número do volume pela ordem em que os volumes do mangá foram cadastrados, igual na consulta da coleção
            List<VolumeManga> volumesManga = manga.getVolumes().stream()
                    .sorted(Comparator.comparing(VolumeManga::getIdVolumeManga))
                    .toList();
            int numeroVolume = volumesManga.indexOf(volume) + 1;

            // Se o volume não tiver capa, uso a capa do mangá
            String capa = volume.getCapaVolume() != null ? volume.getCapaVolume() : manga.getCapaManga();

            ultimos.add(new UltimoAdicionadoDTO(
                    item.getColecao().getIdColecao(),
                    manga.getTituloManga(),
                    capa,
                    numeroVolume,
                    item.getDataAdicao()));
        }

        return ultimos;
    }

    // Conto quantos volumes o usuario tem de cada demografia (Shounen, Seinen, Shoujo...)
    private List<ItemGraficoDTO> montarPrincipaisDemografias(List<Item> itens) {
        Map<String, Long> contagem = itens.stream()
                .collect(Collectors.groupingBy(item -> {
                    String demografia = item.getColecao().getManga().getDemografiaManga();
                    return demografia == null || demografia.isBlank() ? "Sem demografia" : demografia;
                }, Collectors.counting()));

        // Ordeno da demografia com mais volumes para a com menos e pego as principais
        return contagem.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(QUANTIDADE_DEMOGRAFIAS)
                .map(entrada -> new ItemGraficoDTO(entrada.getKey(), entrada.getValue()))
                .toList();
    }
}
