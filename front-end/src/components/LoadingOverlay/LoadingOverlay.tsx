import "./LoadingOverlay.css";

export default function LoadingOverlay({ mensagem }: { mensagem: string }) {
    return (
        <div className="loading-overlay" role="status" aria-live="polite" aria-label={mensagem}>
            <div className="loading-dialog">
                <span className="loading-spinner" aria-hidden="true" />
                <p>{mensagem}</p>
            </div>
        </div>
    );
}
