import api from "./axios";

export const getReports=()=>api.get("/reports");