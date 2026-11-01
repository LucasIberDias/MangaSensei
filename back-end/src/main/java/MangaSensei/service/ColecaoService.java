package MangaSensei.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import MangaSensei.repository.ColecaoRepository;
import MangaSensei.repository.ItemRepository;
import MangaSensei.repository.MangaRepository;
import MangaSensei.repository.UsuarioRepository;
import MangaSensei.dto.colecao.ColecaoDetalheResponseDTO;
import MangaSensei.dto.colecao.ColecaoResponseDTO;
import MangaSensei.dto.colecao.VolumeColecaoResponseDTO;
import MangaSensei.model.Colecao;
import MangaSensei.model.Item;
import MangaSensei.model.Manga;
import MangaSensei.model.Usuario;
import MangaSensei.model.VolumeManga;

@Service
public class ColecaoService {
    private final ColecaoRepository colecaoRepository;
    private final ItemRepository itemRepository;
    private final MangaRepository mangaRepository;
    private final UsuarioRepository usuarioRepository;

    public ColecaoService(
            ColecaoRepository colecaoRepository,
            ItemRepository itemRepository,
            MangaRepository mangaRepository,
            UsuarioRepository usuarioRepository) {
        this.colecaoRepository = colecaoRepository;
        this.itemRepository = itemRepository;
        this.mangaRepository = mangaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // UC08 - Criar Coleção
    public void criarColecao(Long idManga, Long idUsuario) {
        // Pego o usuario que está criando a colecao
        Usuario usuario = usuarioRepository.findById(idUsuario).get();

        // pego o mangá que o ususario deseja fazer coleção
        Manga manga = mangaRepository.findById(idManga).get();

        // Verifico se o Usuario já tem uma colecao desse manga
        if (colecaoRepository.existsByUsuarioIdUsuarioAndMangaIdManga(idUsuario, idManga)) {
            throw new RuntimeException("Não é possivel fazer mais de uma coleção do mesmo mangá");
        }

        // Crio a colecao que vai ser preenchida
        Colecao colecao = new Colecao();

        // Coloco as informacoes na colecao
        colecao.setManga(manga);
        colecao.setUsuario(usuario);

        // Salvo a nova colecao
        colecaoRepository.save(colecao);
    }

    // UC09 - Apresentar Coleções
    public List<ColecaoResponseDTO> buscarColecoes(Long idUsuario) {
        // Faço uma lista de todas coleções do Usuairo
        List<Colecao> colecoes = colecaoRepository.findByUsuarioIdUsuario(idUsuario);

        // Faço uma lista com todos os mangás que serão retornados para o front
        List<ColecaoResponseDTO> response = new ArrayList<>();

        for (Colecao colecao : colecoes) {
            // Armazeno o manga percorrido da vez
            Manga manga = colecao.getManga();

            // Pego quantos mangás o usuario possui da colecão
            long volumesPossuidos = itemRepository.countByColecao_IdColecao(colecao.getIdColecao());

            // Agora pego a quantidade de volumes que o Mangá tem para fazer o calculo
            Long quantidadeVolumes = manga.getQuantidadeVolumes();

            // Crio a variavel que irá informar a porcentagem de quantos mangás o usuario
            // tem
            int porcentagem = 0;

            // Valido que terá mais que 0 de volumes
            if (quantidadeVolumes > 0) {
                porcentagem = (int) ((volumesPossuidos * 100) / quantidadeVolumes);
            }

            // Retorno para o front end a coleção com as informações
            ColecaoResponseDTO dto = new ColecaoResponseDTO(
                    colecao.getIdColecao(),
                    manga.getIdManga(),
                    manga.getTituloManga(),
                    manga.getAutorManga(),
                    manga.getCapaManga(),
                    manga.getDemografiaManga(),
                    quantidadeVolumes,
                    volumesPossuidos,
                    porcentagem);

            response.add(dto);
        }

        // Retorno a Lista com todas as coleções
        return response;
    }

    // UC10 - Remover Coleção
    @Transactional
    public void apagarColecao(Long id, Long idUsuario) {

        // Verifico se a coleção existe
        if (!colecaoRepository.existsById(id)) {
            throw new RuntimeException("Coleção não existe para ser apagada");
        }

        // Pego a coleção que será apagada
        Colecao colecao = colecaoRepository.findById(id).get();
        if (!colecao.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new org.springframework.security.access.AccessDeniedException("Esta coleção pertence a outro usuário.");
        }

        // Apago os itens da coleção antes, pois dependem dela
        itemRepository.deleteByColecao_IdColecao(id);

        // Apago a coleção
        colecaoRepository.delete(colecao);
    }

    // UC11 - Consultar Coleção
    @Transactional(readOnly = true)
    public ColecaoDetalheResponseDTO consultarColecao(Long idColecao, Long idUsuario) {
        // Pego a coleção que será consultada
        Colecao colecao = colecaoRepository.findById(idColecao)
                .orElseThrow(() -> new RuntimeException("Coleção não encontrada"));

        // Verifico se a coleção pertence ao usuario logado
        if (!colecao.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new org.springframework.security.access.AccessDeniedException("Esta coleção pertence a outro usuário.");
        }

        Manga manga = colecao.getManga();

        // Pego os volumes possuidos da coleção, indexados pelo id do volume
        Map<Long, Item> itensPorVolume = itemRepository.findByColecao_IdColecao(idColecao).stream()
                .collect(Collectors.toMap(item -> item.getVolume().getIdVolumeManga(), item -> item));

        // Ordeno os volumes do mangá pela ordem em que foram cadastrados
        List<VolumeManga> volumesManga = manga.getVolumes().stream()
                .sorted(Comparator.comparing(VolumeManga::getIdVolumeManga))
                .toList();

        // Monto a lista com todos os volumes, informando se o usuario possui cada um
        List<VolumeColecaoResponseDTO> volumes = new ArrayList<>();
        for (int i = 0; i < volumesManga.size(); i++) {
            VolumeManga volume = volumesManga.get(i);
            Item item = itensPorVolume.get(volume.getIdVolumeManga());
            boolean possuido = item != null;

            volumes.add(new VolumeColecaoResponseDTO(
                    i + 1,
                    volume.getIdVolumeManga(),
                    volume.getCapaVolume(),
                    volume.getIsbnVolume(),
                    possuido,
                    possuido ? item.getIdItem() : null,
                    possuido ? item.getEstadoVolume() : null,
                    possuido ? item.getValorPago() : null,
                    possuido ? item.getDataCompra() : null));
        }

        // Calculo a porcentagem de volumes possuidos
        long volumesPossuidos = itensPorVolume.size();
        Long quantidadeVolumes = manga.getQuantidadeVolumes();
        int porcentagem = quantidadeVolumes > 0 ? (int) ((volumesPossuidos * 100) / quantidadeVolumes) : 0;

        // Retorno a coleção com todos os volumes
        return new ColecaoDetalheResponseDTO(
                colecao.getIdColecao(),
                manga.getIdManga(),
                manga.getTituloManga(),
                manga.getAutorManga(),
                manga.getCapaManga(),
                manga.getEditoraManga(),
                manga.getDemografiaManga(),
                quantidadeVolumes,
                volumesPossuidos,
                porcentagem,
                volumes);
    }
}
