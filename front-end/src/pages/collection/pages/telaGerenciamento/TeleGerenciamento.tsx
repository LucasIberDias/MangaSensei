import { Link, useParams } from "react-router-dom";
import MenuNavegacao from "../../../../components/NavigationMenu/MenuNavegacao";

export default function TeleGerenciamento() {
    const { idColecao } = useParams();

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <Link to="/colecao">← Voltar para coleção</Link>
                <h1>Gerenciamento da coleção</h1>
                <p>Coleção: {idColecao}</p>
            </main>
        </div>
    );
}
