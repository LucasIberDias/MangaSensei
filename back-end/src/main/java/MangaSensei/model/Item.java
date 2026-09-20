package MangaSensei.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
    name = "item",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"idColecao", "idVolume"})}
)

@Getter
@Setter
@NoArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItem;

    private Double valorPago;

    private LocalDate dataCompra;

    private String estadoVolume;

    @ManyToOne
    @JoinColumn(name = "idColecao", nullable = false)
    private Colecao colecao;

    @ManyToOne
    @JoinColumn(name = "idVolume", nullable = false)
    private VolumeManga volume;
}