import { apiRequest } from "./api";
import type { CadastroUsuario, Usuario } from "../types";

export const usuarioService = {
    atualizar(dados: Partial<CadastroUsuario>) {
        return apiRequest<Usuario>("/usuario", {
            method: "PATCH",
            body: JSON.stringify(dados),
        });
    },
};
