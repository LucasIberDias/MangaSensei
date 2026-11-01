import { apiRequest } from "./api";
import type { Dashboard } from "../types";

export const dashboardService = {
    apresentar() {
        return apiRequest<Dashboard>("/dashboard");
    },
};
