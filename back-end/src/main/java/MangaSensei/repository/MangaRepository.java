package MangaSensei.repository;

import MangaSensei.model.Manga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MangaRepository extends JpaRepository<Manga, Long> {
    // Função para localizar o manga 
    Optional<Manga> findByTituloManga(String tituloManga);
}