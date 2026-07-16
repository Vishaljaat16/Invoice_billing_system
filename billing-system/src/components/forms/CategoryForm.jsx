import { useState } from "react";

export default function CategoryForm({

    onSubmit,

    initialData

}) {

    const [name, setName] = useState(

        initialData?.name || ""

    );

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({ name });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <input

                className="w-full border rounded p-3"

                placeholder="Category Name"

                value={name}

                onChange={(e)=>setName(e.target.value)}

            />

            <button

                className="bg-blue-600 text-white px-4 py-2 rounded"

            >

                Save

            </button>

        </form>

    );

}