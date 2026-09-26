import "./TelaColecao.css";

import { useState } from "react";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";

export default function TelaColecao() {

    const [mostrarAdicionar, setMostrarAdicionar] = useState(false);

    return (
        <div className="pagina">
            <MenuNavegacao />

            <div className="conteudo">

                <div className="topo">

                    <div>
                        <h1>Coleção</h1>
                        <p>Gerencie sua coleção de maneira inteligente!</p>
                    </div>

                    <button
                        className="botaoAdicionar"
                        onClick={() => setMostrarAdicionar(true)}
                    >
                        + Adicionar mangá
                    </button>

                </div>

            </div>


            {mostrarAdicionar && (
                <div className="fundoModal">

                    <div className="modalAdicionar">

                        <button
                            className="fecharModal"
                            onClick={() => setMostrarAdicionar(false)}
                        >
                            ×
                        </button>

                        <h2>Adicionar mangá</h2>

                        <p>
                            Pesquise o mangá que deseja adicionar à sua coleção.
                        </p>

                        <div className="campoPesquisa">

                            <input
                                type="text"
                                placeholder="Digite o nome do mangá..."
                            />

                            <button>
                                Pesquisar
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}