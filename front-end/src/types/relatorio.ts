import type { EstadoVolume } from "./colecao";

export interface RelatorioVolume {
    numeroVolume: number;
    isbnVolume: string | null;
    estadoVolume: EstadoVolume | null;
    valorPago: number | null;
    dataCompra: string | null;
    quantidade: number | null;
}

export interface RelatorioManga {
    idColecao: number;
    tituloManga: string;
    autorManga: string;
    editoraManga: string | null;
    demografiaManga: string | null;
    capaManga: string | null;
    quantidadeVolumes: number;
    volumesPossuidos: number;
    volumesFaltando: number;
    porcentagem: number;
    volumesRepetidos: number;
    valorInvestido: number;
    ultimaCompra: string | null;
    volumes: RelatorioVolume[];
}

export interface Relatorio {
    totalObras: number;
    obrasCompletas: number;
    obrasEmAndamento: number;
    obrasNaoIniciadas: number;
    volumesPossuidos: number;
    volumesFaltando: number;
    volumesRepetidos: number;
    valorTotal: number;
    valorMedioVolume: number;
    progressoGeral: number;
    mangas: RelatorioManga[];
}
