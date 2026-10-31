import { apiRequest } from "./api";
import type { CadastroUsuario, Usuario } from "../types";

export const usuarioService = {
    atualizar(dados: Partial<Omit<CadastroUsuario, "senhaUsuario">> & { fotoPerfil?: string }) {
        return apiRequest<Usuario>("/usuario", {
            method: "PATCH",
            body: JSON.stringify(dados),
        });
    },
    atualizarSenha(senhaAtual: string, novaSenha: string) {
        return apiRequest<void>("/usuario/senha", {
            method: "PATCH",
            body: JSON.stringify({ senhaAtual, novaSenha }),
        });
    },
};
