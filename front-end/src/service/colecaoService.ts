import { apiRequest } from "./api";
import type { Colecao } from "../types";

export const colecaoService = {
    listar() {
        return apiRequest<Colecao[]>("/colecao");
    },

    adicionar(idManga: number) {
        return apiRequest<void>(`/colecao?idManga=${idManga}`, {
            method: "POST",
        });
    },

    remover(idColecao: number) {
        return apiRequest<void>(`/colecao?idColecao=${idColecao}`, { method: "DELETE" });
    },
};
