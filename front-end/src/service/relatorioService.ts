import { apiRequest } from "./api";
import type { Relatorio } from "../types";

export const relatorioService = {
    gerar() {
        return apiRequest<Relatorio>("/relatorio");
    },
};
