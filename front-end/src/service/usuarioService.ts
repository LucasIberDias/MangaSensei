import { apiRequest } from "./api";
import type { CadastroUsuario, Usuario } from "./types";

export const usuarioService = {
    atualizar(idUsuario: number, dados: Partial<CadastroUsuario>) {
        return apiRequest<Usuario>(`/usuario/${idUsuario}`, {
            method: "PATCH",
            body: JSON.stringify(dados),
        });
    },
};
