package MangaSensei.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "colecao",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"idUsuario", "idManga"})}
)

@Getter
@Setter
@NoArgsConstructor
public class Colecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idColecao;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idManga", nullable = false)
    private Manga manga;
}