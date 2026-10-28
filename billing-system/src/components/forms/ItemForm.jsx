import { useState } from "react";

const ItemForm = ({ initialData, categories, onSubmit }) => {

    const [form, setForm] = useState({

        name: initialData?.name || "",

        price: initialData?.price || "",

        quantity: initialData?.quantity || "",

        gst: initialData?.gst || "",

        category_id: initialData?.category_id || ""

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const submit = (e) => {

        e.preventDefault();

        onSubmit(form);

    };

    return (

        <form
            onSubmit={submit}
            className="space-y-4"
        >

            <input
                name="name"
                placeholder="Item Name"
                className="w-full border rounded p-3"
                value={form.name}
                onChange={handleChange}
            />

            <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full border rounded p-3"
                value={form.price}
                onChange={handleChange}
            />

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                className="w-full border rounded p-3"
                value={form.quantity}
                onChange={handleChange}
            />

            <input
                type="number"
                name="gst"
                placeholder="GST %"
                className="w-full border rounded p-3"
                value={form.gst}
                onChange={handleChange}
            />

            <select

                name="category_id"

                className="w-full border rounded p-3"

                value={form.category_id}

                onChange={handleChange}

            >

                <option value="">

                    Select Category

                </option>

                {categories.map(category=>(

                    <option

                        key={category.id}

                        value={category.id}

                    >

                        {category.name}

                    </option>

                ))}

            </select>

            <button

                className="bg-blue-600 text-white w-full py-3 rounded"

            >

                Save Item

            </button>

        </form>

    );

};

export default ItemForm;