import { useEffect, useState } from "react";
import { getItems } from "../../api/itemApi";
import InvoiceForm from "../../components/invoice/InvoiceForm";

const Invoice = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {

        loadItems();

    }, []);

    const loadItems = async () => {

        try {

            const response = await getItems();

            setItems(response.data || []);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div>

            <h1 className="text-3xl font-bold mb-8">

                Generate Invoice

            </h1>

            <InvoiceForm

                items={items}

            />

        </div>

    );

};

export default Invoice;