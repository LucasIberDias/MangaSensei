import "./TelaColecao.css";

import MenuNavegacao from "../../../components/Menus/menuNavegacao/MenuNavegacao";

export default function TelaColecao() {
    return (
        <div className="pagina">
            <MenuNavegacao />

            <div className="conteudo">
                <div className="topo">
                    <h1>Coleção</h1>
                    <p>Gerencie sua coleção de maneira inteligente!</p>
                </div>

            </div>
        </div>
    );
}