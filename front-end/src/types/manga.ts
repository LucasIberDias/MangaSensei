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
