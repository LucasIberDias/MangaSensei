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

export interface VolumeColecao {
    numeroVolume: number;
    idVolumeManga: number | null;
    capaVolume: string | null;
    isbnVolume: string | null;
    possuido: boolean;
    idItem: number | null;
    estadoVolume: EstadoVolume | null;
    valorPago: number | null;
    dataCompra: string | null;
    quantidade: number | null;
}

export interface ColecaoDetalhe {
    idColecao: number;
    idManga: number;
    tituloManga: string;
    autorManga: string;
    capaManga: string;
    editoraManga: string;
    demografiaManga: string;
    quantidadeVolumes: number;
    volumesPossuidos: number;
    porcentagem: number;
    volumes: VolumeColecao[];
}

// Estados que um volume da coleção pode ter, iguais ao enum EstadoVolume do back-end
export const EstadoVolume = {
    NOVO: "Novo",
    SEMINOVO: "Seminovo",
    USADO: "Usado",
    DANIFICADO: "Danificado",
} as const;

export type EstadoVolume = typeof EstadoVolume[keyof typeof EstadoVolume];

export interface AtualizarVolume {
    estadoVolume: EstadoVolume;
    valorPago: number | null;
    dataCompra: string | null;
}

export interface AdicionarVolume {
    idVolumeManga: number;
    estadoVolume: EstadoVolume;
    valorPago: number | null;
    dataCompra: string | null;
}
