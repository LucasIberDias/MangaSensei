package MangaSensei.repository;

import MangaSensei.model.Colecao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ColecaoRepository extends JpaRepository<Colecao, Long> {
    boolean existsByUsuarioIdUsuarioAndMangaIdManga(Long idUsuario, Long idManga);

    // Busca a colecao peelo id de um usuario
    List<Colecao> findByUsuarioIdUsuario(Long idUsuario);
}
