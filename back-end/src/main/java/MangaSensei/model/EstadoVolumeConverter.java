package MangaSensei.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

// Salva o estado no banco pela descrição ("Novo", "Seminovo"...), assim os volumes que já existem continuam funcionando
@Converter(autoApply = true)
public class EstadoVolumeConverter implements AttributeConverter<EstadoVolume, String> {

    @Override
    public String convertToDatabaseColumn(EstadoVolume estado) {
        return estado == null ? null : estado.getDescricao();
    }

    @Override
    public EstadoVolume convertToEntityAttribute(String descricao) {
        return EstadoVolume.deDescricao(descricao);
    }
}
