import { useState } from "react";
import API from "../api";

export default function Invoice() {
  const [form, setForm] = useState({ title: "", amount: "", description: "" });

  const submit = async () => {
    await API.get("/invoice");
    alert("Created!");
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

      <input className="w-full mb-3 p-2 border rounded" placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <input className="w-full mb-3 p-2 border rounded" placeholder="Amount"
        onChange={(e) => setForm({ ...form, amount: e.target.value })} />

      <textarea className="w-full mb-4 p-2 border rounded" placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </div>
  );
}