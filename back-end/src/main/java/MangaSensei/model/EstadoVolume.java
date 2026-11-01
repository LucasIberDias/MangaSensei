package MangaSensei.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

// Estados que um volume da coleção pode ter, na ordem em que aparecem na tela
public enum EstadoVolume {
    NOVO("Novo"),
    SEMINOVO("Seminovo"),
    USADO("Usado"),
    DANIFICADO("Danificado");

    // Texto que aparece para o usuario e que é salvo no banco
    private final String descricao;

    EstadoVolume(String descricao) {
        this.descricao = descricao;
    }

    // O front-end recebe e envia o estado pela descrição, ex: "Seminovo"
    @JsonValue
    public String getDescricao() {
        return descricao;
    }

    // Converto a descrição que veio do front-end ou do banco para o estado
    @JsonCreator
    public static EstadoVolume deDescricao(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            return null;
        }

        for (EstadoVolume estado : values()) {
            if (estado.descricao.equalsIgnoreCase(descricao.trim())) {
                return estado;
            }
        }

        throw new IllegalArgumentException("Estado do volume inválido: " + descricao);
    }
}
