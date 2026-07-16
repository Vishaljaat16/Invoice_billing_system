import api from "./axios";

export const getItems=()=>api.get("/getitems");

export const addItem=(data)=>api.post("/additems",data);

export const updateItem=(id,data)=>
api.patch(`/updateitems/${id}`,data);

export const deleteItem=(id)=>
api.delete(`/deleteitems/${id}`);