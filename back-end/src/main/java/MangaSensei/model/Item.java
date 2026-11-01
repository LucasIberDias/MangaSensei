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

    private EstadoVolume estadoVolume;

    // Data em que o volume foi adicionado na coleção, usada nos últimos adicionados da dashboard
    private LocalDate dataAdicao;

    // Quantidade de cópias que o usuario tem desse volume (volumes repetidos)
    @Column(nullable = false, columnDefinition = "integer default 1")
    private Integer quantidade = 1;

    @ManyToOne
    @JoinColumn(name = "idColecao", nullable = false)
    private Colecao colecao;

    @ManyToOne
    @JoinColumn(name = "idVolume", nullable = false)
    private VolumeManga volume;
}