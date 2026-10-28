import type { Manga as MangaModel } from "../../../../types";
import "./MangaCard.css";

type MangaCardProps = {
    manga: MangaModel;
    onSelect: (manga: MangaModel) => void;
};

export default function MangaCard({ manga, onSelect }: MangaCardProps) {
    return (
        <button className="manga-card" type="button" onClick={() => onSelect(manga)}>
            <span className="manga-card__cover">
                <img src={manga.capaManga} alt={`Capa de ${manga.tituloManga}`} loading="lazy" />
                <span className="manga-card__volumes">{manga.quantidadeVolumes} volumes</span>
            </span>
            <span className="manga-card__title">{manga.tituloManga}</span>
        </button>
    );
}
