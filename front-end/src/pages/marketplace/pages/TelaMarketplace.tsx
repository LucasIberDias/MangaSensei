import { FaStore } from "react-icons/fa";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import "./TelaMarketplace.css";

export default function TelaMarketplace() {
    return (
        <div className="paginaMarketplace">
            <MenuNavegacao />
            <main className="conteudoMarketplace">
                <section className="avisoMarketplace" aria-labelledby="tituloMarketplace">
                    <FaStore className="iconeMarketplace" aria-hidden="true" />
                    <h1 id="tituloMarketplace">Marketplace</h1>
                    <p>Em breve futuras atualizações</p>
                </section>
            </main>
        </div>
    );
}
