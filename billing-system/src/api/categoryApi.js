import api from "./axios";

export const getCategories=()=>api.get("/getcategory");

export const addCategory=(data)=>api.post("/addcategory",data);

export const updateCategory=(id,data)=>
api.patch(`/updatecategory/${id}`,data);

export const deleteCategory=(id)=>
api.delete(`/deletecategory/${id}`);