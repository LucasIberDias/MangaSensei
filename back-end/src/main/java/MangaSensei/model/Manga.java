package MangaSensei.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "manga")
@Getter
@Setter
@NoArgsConstructor
public class Manga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idManga;

    private String tituloManga;

    private String autorManga;

    private String capaManga;

    private String editoraManga;

    private String demografiaManga;

    private Long quantidadeVolumes;

    @OneToMany(mappedBy = "manga", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<VolumeManga> volumes = new ArrayList<>();
}