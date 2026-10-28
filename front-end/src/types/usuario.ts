export interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    emailUsuario: string;
    fotoPerfil: string;
}

export interface CadastroUsuario {
    nomeUsuario: string;
    emailUsuario: string;
    senhaUsuario: string;
    fotoPerfil?: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}
