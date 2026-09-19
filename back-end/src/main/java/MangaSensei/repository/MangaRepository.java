package MangaSensei.repository;

import MangaSensei.model.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MangaRepository extends JpaRepository<Manga, Long> {
    // Função para localizar o manga pelo titulo exato
    Optional<Manga> findByTituloManga(String tituloManga);

    // Busca por nome parcial do manga
    Optional<Manga> findByTituloMangaContainingIgnoreCase(String tituloManga);

    // Busca e preenche uma lista de mangás de uma demografia especifica
    List<Manga> findByDemografiaMangaContainingIgnoreCase(String demografiaManga);

    // Busca todas as demografias diferentes
    @Query("SELECT DISTINCT m.demografiaManga FROM Manga m")
    List<String> findDistinctDemografiaManga();

}