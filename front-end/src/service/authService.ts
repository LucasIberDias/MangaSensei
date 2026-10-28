import { apiRequest } from "./api";
import type { CadastroUsuario, LoginResponse, Usuario } from "../types";

const STORAGE_KEY = "usuario";

function validarUsuario(usuario: Usuario | undefined): Usuario {
    if (!usuario || typeof usuario.idUsuario !== "number") {
        throw new Error("A API nÃ£o retornou os dados esperados do usuÃ¡rio.");
    }
    return usuario;
}

export const authService = {
    async login(emailUsuario: string, senhaUsuario: string) {
        const resposta = await apiRequest<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ emailUsuario, senhaUsuario }),
        });
        const usuario = validarUsuario(resposta?.usuario);
        if (!resposta?.token) throw new Error("A API não retornou um token de acesso.");
        return { usuario, token: resposta.token };
    },

    async cadastrar(dados: CadastroUsuario) {
        const usuario = await apiRequest<Usuario>("/usuario", {
            method: "POST",
            body: JSON.stringify(dados),
        });
        return validarUsuario(usuario);
    },

    salvarSessao(usuario: Usuario, token: string) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ usuario, token }));
    },

    salvarUsuarioSessao(usuario: Usuario) {
        const token = this.obterToken();
        if (token) this.salvarSessao(usuario, token);
    },

    obterToken(): string | null {
        try {
            const valor = localStorage.getItem(STORAGE_KEY);
            const sessao = valor ? JSON.parse(valor) as { token?: string } : null;
            return sessao?.token ?? null;
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    },

    obterSessao(): Usuario | null {
        try {
            const valor = localStorage.getItem(STORAGE_KEY);
            const sessao = valor ? JSON.parse(valor) as { usuario?: Usuario; token?: string } : null;
            return sessao?.usuario && sessao.token ? sessao.usuario : null;
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    },

    encerrarSessao() {
        localStorage.removeItem(STORAGE_KEY);
    },
};
