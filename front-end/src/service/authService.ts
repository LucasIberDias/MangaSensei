import { apiRequest } from "./api";
import type { CadastroUsuario, Usuario } from "./types";

const STORAGE_KEY = "usuario";

function validarUsuario(usuario: Usuario | undefined): Usuario {
    if (!usuario || typeof usuario.idUsuario !== "number") {
        throw new Error("A API não retornou os dados esperados do usuário.");
    }
    return usuario;
}

export const authService = {
    async login(emailUsuario: string, senhaUsuario: string) {
        const usuario = await apiRequest<Usuario>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ emailUsuario, senhaUsuario }),
        });
        return validarUsuario(usuario);
    },

    async cadastrar(dados: CadastroUsuario) {
        const usuario = await apiRequest<Usuario>("/usuario", {
            method: "POST",
            body: JSON.stringify(dados),
        });
        return validarUsuario(usuario);
    },

    salvarSessao(usuario: Usuario) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    },

    obterSessao(): Usuario | null {
        try {
            const valor = localStorage.getItem(STORAGE_KEY);
            return valor ? JSON.parse(valor) as Usuario : null;
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    },

    encerrarSessao() {
        localStorage.removeItem(STORAGE_KEY);
    },
};
