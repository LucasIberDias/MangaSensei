export interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    emailUsuario: string;
    fotoPerfil: string;
}

export interface VolumeManga {
    idVolumeManga: number;
    capaVolume: string;
    isbnVolume: string;
}

export interface Manga {
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
    volumes?: VolumeManga[];
}

export interface Colecao {
    idColecao: number;
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
    volumesPossuidos: number;
    porcentagem: number;
}

export interface CadastroUsuario {
    nomeUsuario: string;
    emailUsuario: string;
    senhaUsuario: string;
    fotoPerfil?: string;
}
