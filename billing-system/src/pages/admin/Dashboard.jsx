import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard";

import { getCategories } from "../../api/categoryApi";
import { getItems } from "../../api/itemApi";

export default function Dashboard() {

    const [categories, setCategories] = useState([]);

    const [items, setItems] = useState([]);

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const categoryRes = await getCategories();

            const itemRes = await getItems();

            setCategories(categoryRes.data || []);

            setItems(itemRes.data || []);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div>

            <h1 className="text-3xl font-bold mb-8">

                Admin Dashboard

            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatCard

                    title="Categories"

                    value={categories.length}

                    color="text-blue-600"

                />

                <StatCard

                    title="Items"

                    value={items.length}

                    color="text-green-600"

                />

                <StatCard

                    title="Staff"

                    value="12"

                    color="text-red-600"

                />

                <StatCard

                    title="Revenue"

                    value="₹52,000"

                    color="text-yellow-500"

                />

            </div>

        </div>

    );

}