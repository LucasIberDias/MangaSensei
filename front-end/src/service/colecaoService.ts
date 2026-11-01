import { apiRequest } from "./api";
import type { AdicionarVolume, Colecao, ColecaoDetalhe } from "../types";

export const colecaoService = {
    listar() {
        return apiRequest<Colecao[]>("/colecao");
    },

    consultar(idColecao: number) {
        return apiRequest<ColecaoDetalhe>(`/colecao/${idColecao}`);
    },

    adicionar(idManga: number) {
        return apiRequest<void>(`/colecao?idManga=${idManga}`, {
            method: "POST",
        });
    },

    adicionarVolume(idColecao: number, dados: AdicionarVolume) {
        return apiRequest<void>(`/colecao/${idColecao}/volume`, {
            method: "POST",
            body: JSON.stringify(dados),
        });
    },

    remover(idColecao: number) {
        return apiRequest<void>(`/colecao?idColecao=${idColecao}`, { method: "DELETE" });
    },
};
