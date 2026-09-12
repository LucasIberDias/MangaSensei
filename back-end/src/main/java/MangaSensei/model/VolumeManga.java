package MangaSensei.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "volumeManga")
@Getter
@Setter
@NoArgsConstructor
public class VolumeManga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVolumeManga;

    private String capaVolume;

    private String isbnVolume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idManga", nullable = false)
    private Manga manga;
}