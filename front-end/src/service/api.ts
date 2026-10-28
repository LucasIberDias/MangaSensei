const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...init?.headers,
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `A requisição falhou (${response.status}).`);
    }

    if (response.status === 204) return undefined as T;
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json")
        ? response.json() as Promise<T>
        : undefined as T;
}

export function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message ? error.message : fallback;
}
