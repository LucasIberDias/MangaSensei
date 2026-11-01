import "./FormularioVolume.css";

import { useState, type FormEvent } from "react";
import { FaBook, FaPlus, FaTimes } from "react-icons/fa";

import { getErrorMessage } from "../../../../service/api";
import { EstadoVolume, type AdicionarVolume, type VolumeColecao } from "../../../../types";

export default function FormularioVolume({ volume, tituloManga, onSalvar, onFechar }: {
    volume: VolumeColecao;
    tituloManga: string;
    onSalvar: (dados: AdicionarVolume) => Promise<void>;
    onFechar: () => void;
}) {
    const [estadoVolume, setEstadoVolume] = useState<EstadoVolume>(EstadoVolume.NOVO);
    const [valorPago, setValorPago] = useState("");
    const [dataCompra, setDataCompra] = useState("");

    const [mensagemErro, setMensagemErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    const hoje = new Date().toLocaleDateString("sv-SE");

    const enviarFormulario = async (event: FormEvent) => {
        event.preventDefault();

        if (volume.idVolumeManga == null) {
            setMensagemErro("Este volume não pode ser adicionado.");
            return;
        }

        try {
            setSalvando(true);
            setMensagemErro("");
            await onSalvar({
                idVolumeManga: volume.idVolumeManga,
                estadoVolume,
                valorPago: valorPago === "" ? null : Number(valorPago),
                dataCompra: dataCompra || null,
            });
        } catch (error) {
            setMensagemErro(getErrorMessage(error, "Não foi possível adicionar o volume."));
            setSalvando(false);
        }
    };

    return (
        <div className="fundoFormularioVolume" onClick={onFechar}>
            <form
                className="formularioVolume"
                onSubmit={enviarFormulario}
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tituloFormularioVolume"
            >
                <div className="cabecalhoFormularioVolume">
                    <h2 id="tituloFormularioVolume">Adicionar Volume</h2>
                    <button type="button" className="fecharFormularioVolume" onClick={onFechar} aria-label="Fechar">
                        <FaTimes />
                    </button>
                </div>

                <div className="volumeFormulario">
                    {volume.capaVolume
                        ? <img src={volume.capaVolume} alt="" />
                        : <span className="semCapa"><FaBook /></span>}
                    <div>
                        <strong>Volume {volume.numeroVolume}</strong>
                        <p>{tituloManga}</p>
                    </div>
                </div>

                <label>
                    Condição
                    <select value={estadoVolume} onChange={(e) => setEstadoVolume(e.target.value as EstadoVolume)} required>
                        {Object.values(EstadoVolume).map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </label>

                <div className="linhaFormularioVolume">
                    <label>
                        Valor pago (R$)
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            value={valorPago}
                            onChange={(e) => setValorPago(e.target.value)}
                        />
                    </label>

                    <label>
                        Data da compra
                        <input
                            type="date"
                            max={hoje}
                            value={dataCompra}
                            onChange={(e) => setDataCompra(e.target.value)}
                        />
                    </label>
                </div>

                {mensagemErro && <p className="mensagemErro" role="alert">{mensagemErro}</p>}

                <div className="acoesFormularioVolume">
                    <button type="button" className="botaoCancelar" onClick={onFechar}>Cancelar</button>
                    <button type="submit" className="botaoAcao" disabled={salvando}>
                        <FaPlus /> {salvando ? "Adicionando..." : "Adicionar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
