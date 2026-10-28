import { apiRequest } from "./api";
import type { Manga } from "./types";

export const mangaService = {
    pesquisar(titulo: string) {
        return apiRequest<Manga>(`/manga?titulo=${encodeURIComponent(titulo)}`);
    },

    listarPorDemografia() {
        return apiRequest<Record<string, Manga[]>>("/manga/demografia");
    },
};
