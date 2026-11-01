import { apiRequest } from "./api";
import type { Colecao, ColecaoDetalhe } from "../types";

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

    remover(idColecao: number) {
        return apiRequest<void>(`/colecao?idColecao=${idColecao}`, { method: "DELETE" });
    },
};
