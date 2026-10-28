import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../service/authService";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    return authService.obterSessao() ? children : <Navigate to="/" replace />;
}

