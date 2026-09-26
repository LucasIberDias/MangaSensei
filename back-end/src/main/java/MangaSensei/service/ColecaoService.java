package MangaSensei.service;

import org.springframework.stereotype.Service;

import MangaSensei.repository.ColecaoRepository;
import MangaSensei.repository.ItemRepository;
import MangaSensei.repository.MangaRepository;
import MangaSensei.repository.UsuarioRepository;

import MangaSensei.model.Colecao;
import MangaSensei.model.Manga;
import MangaSensei.model.Usuario;

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
}
