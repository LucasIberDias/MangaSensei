import { apiRequest } from "./api";
import type { Colecao } from "./types";

export const colecaoService = {
    listar(idUsuario: number) {
        return apiRequest<Colecao[]>(`/colecao?idUsuario=${idUsuario}`);
    },

    adicionar(idManga: number, idUsuario: number) {
        return apiRequest<void>(`/colecao?idManga=${idManga}&idUsuario=${idUsuario}`, {
            method: "POST",
        });
    },

    remover(idColecao: number) {
        return apiRequest<void>(`/colecao?idColecao=${idColecao}`, { method: "DELETE" });
    },
};
