import type { Colecao } from "../../../service/types";

export default function CollectionCard({ colecao, onRemove, removing }: {
    colecao: Colecao;
    onRemove: (idColecao: number) => void;
    removing: boolean;
}) {
    return (
        <article className="cardColecao">
            <img src={colecao.capaManga} alt={colecao.tituloManga} className="capaColecao" />
            <div className="informacoesColecao">
                <h3>{colecao.tituloManga}</h3>
                <p className="autorColecao">{colecao.autorManga}</p>
                <div className="progressoColecao">
                    <span className="quantidadeVolumes">{colecao.volumesPossuidos}/{colecao.quantidadeVolumes} volumes</span>
                    <div className="barraContainer"><div className="barraProgresso" style={{ width: `${colecao.porcentagem}%` }} /></div>
                    <span className={colecao.porcentagem >= 100 ? "porcentagem completa" : "porcentagem"}>
                        {colecao.porcentagem >= 100 ? "Completa!" : `${colecao.porcentagem}%`}
                    </span>
                </div>
                <p className="demografiaColecao">{colecao.demografiaManga}</p>
            </div>
            <button className="menuColecao" type="button" aria-label={`Remover ${colecao.tituloManga} da coleção`} disabled={removing} onClick={() => onRemove(colecao.idColecao)}>
                {removing ? "…" : "×"}
            </button>
        </article>
    );
}

