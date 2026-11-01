export interface ItemGrafico {
    nome: string;
    quantidade: number;
}

export interface UltimoAdicionado {
    idColecao: number;
    tituloManga: string;
    capa: string | null;
    numeroVolume: number;
    dataAdicao: string | null;
}

export interface Dashboard {
    volumesNaColecao: number;
    obrasDiferentes: number;
    valorTotal: number;
    obrasCompletas: number;
    estadoColecao: ItemGrafico[];
    investimentoAte25: number;
    investimento25a50: number;
    investimentoAcima50: number;
    ultimosAdicionados: UltimoAdicionado[];
    principaisDemografias: ItemGrafico[];
}
