import { FaArrowLeft, FaMagnifyingGlass } from "react-icons/fa6";
import "./MangaNaoEncontrado.css";

export default function MangaNaoEncontrado({ onVoltar }: { onVoltar: () => void }) {
    return (
        <section className="estado-manga-nao-encontrado" aria-labelledby="titulo-nao-encontrado">
            <div className="ilustracao-nao-encontrado" aria-hidden="true">
                <FaMagnifyingGlass />
                <span>?</span>
            </div>
            <p className="etiqueta-nao-encontrado">PESQUISA SEM RESULTADOS</p>
            <h2 id="titulo-nao-encontrado">Não encontramos esse mangá</h2>
            <p className="descricao-nao-encontrado">
                Confira se o título foi digitado corretamente ou volte à exploração para tentar outra busca.
            </p>
            <button className="botao-voltar-exploracao" type="button" onClick={onVoltar}>
                <FaArrowLeft aria-hidden="true" />
                <span>Voltar para a exploração</span>
            </button>
        </section>
    );
}
