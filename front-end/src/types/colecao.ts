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
    estadoVolume: string | null;
    valorPago: number | null;
    dataCompra: string | null;
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

export interface AdicionarVolume {
    idVolumeManga: number;
    estadoVolume: string;
    valorPago: number | null;
    dataCompra: string | null;
}
