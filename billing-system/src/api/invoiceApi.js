import api from "./axios";

export const createInvoice=(data)=>
api.post("/invoice",data);