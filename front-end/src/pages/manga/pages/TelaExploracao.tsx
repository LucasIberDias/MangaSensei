import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuNavegacao from "../../../components/NavigationMenu/MenuNavegacao";
import InputPesquisa from "../../../components/Input/InputPesquisa";
import MangaCard from "../components/MangaCard/MangaCard";
import { mangaService } from "../../../service/mangaService";
import { getErrorMessage } from "../../../service/api";
import type { Manga } from "../../../service/types";
import "./TelaExploracao.css";

export default function Exploracao() {
    const [pesquisa, setPesquisa] = useState("");
    const [mangasPorDemografia, setMangasPorDemografia] = useState<Record<string, Manga[]>>({});
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        mangaService.listarPorDemografia()
            .then(setMangasPorDemografia)
            .catch((error: unknown) => setErro(getErrorMessage(error, "Não foi possível carregar os mangás.")));
    }, []);

    const pesquisarManga = async (titulo = pesquisa) => {
        if (!titulo.trim()) return;
        try {
            const mangaPesquisado = await mangaService.pesquisar(titulo);
            navigate("/pesquisa", { state: { mangaPesquisado, erro: false } });
        } catch {
            navigate("/pesquisa", { state: { mangaPesquisado: null, erro: true } });
        }
    };

    return (
        <div className="pagina">
            <MenuNavegacao />
            <main className="conteudo">
                <div className="topo">
                    <h1>Exploração</h1>
                    <p>Descubra novos mangás para aumentar sua coleção!</p>
                    <div className="acoes">
                        <InputPesquisa value={pesquisa} onChange={setPesquisa} onEnter={() => pesquisarManga()} />
                    </div>
                </div>
                {erro && <p className="erro-exploracao" role="alert">{erro}</p>}
                <div className="lista-demografias">
                    {Object.entries(mangasPorDemografia).map(([demografia, mangas]) => (
                        <section className="secao-demografia" key={demografia}>
                            <div className="cabecalho-demografia"><h2>{demografia}</h2></div>
                            <div className="lista-mangas">
                                {mangas.map((manga) => (
                                    <MangaCard key={manga.idManga} manga={manga} onSelect={(selecionado) => pesquisarManga(selecionado.tituloManga)} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </div>
    );
}


