import { useState } from "react";
import { createInvoice } from "../../api/invoiceApi";
import toast from "react-hot-toast";

const InvoiceForm = ({ items }) => {

    const [customerName, setCustomerName] = useState("");

    const [customerPhone, setCustomerPhone] = useState("");

    const [invoiceItems, setInvoiceItems] = useState([]);

    const [discount, setDiscount] = useState(0);

    const addItem = () => {

        setInvoiceItems([

            ...invoiceItems,

            {

                item_id: "",

                quantity: 1

            }

        ]);

    };

    const updateItem = (index, key, value) => {

        const updated = [...invoiceItems];

        updated[index][key] = value;

        setInvoiceItems(updated);

    };

    const calculateTotal = () => {

        let total = 0;

        invoiceItems.forEach((invoiceItem) => {

            const item = items.find(

                (i) => i.id == invoiceItem.item_id

            );

            if (item) {

                total += item.price * invoiceItem.quantity;

            }

        });

        return total - discount;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await createInvoice({

                customer_name: customerName,

                customer_phone: customerPhone,

                items: invoiceItems,

                discount

            });

            toast.success("Invoice Created");

        } catch (err) {

            console.log(err);

            toast.error("Unable to create invoice");

        }

    };

    return (

        <form

            onSubmit={handleSubmit}

            className="space-y-6"

        >

            <div className="grid grid-cols-2 gap-5">

                <input

                    placeholder="Customer Name"

                    className="border rounded-lg p-3"

                    value={customerName}

                    onChange={(e)=>setCustomerName(e.target.value)}

                />

                <input

                    placeholder="Customer Phone"

                    className="border rounded-lg p-3"

                    value={customerPhone}

                    onChange={(e)=>setCustomerPhone(e.target.value)}

                />

            </div>

            {invoiceItems.map((row,index)=>(

                <div

                    key={index}

                    className="grid grid-cols-2 gap-5"

                >

                    <select

                        className="border rounded p-3"

                        value={row.item_id}

                        onChange={(e)=>

                            updateItem(index,"item_id",e.target.value)

                        }

                    >

                        <option>

                            Select Item

                        </option>

                        {items.map(item=>(

                            <option

                                key={item.id}

                                value={item.id}

                            >

                                {item.name}

                            </option>

                        ))}

                    </select>

                    <input

                        type="number"

                        min="1"

                        className="border rounded p-3"

                        value={row.quantity}

                        onChange={(e)=>

                            updateItem(index,"quantity",e.target.value)

                        }

                    />

                </div>

            ))}

            <button

                type="button"

                onClick={addItem}

                className="bg-green-600 text-white px-4 py-2 rounded"

            >

                Add Item

            </button>

            <input

                type="number"

                placeholder="Discount"

                className="border rounded-lg p-3 w-full"

                value={discount}

                onChange={(e)=>setDiscount(Number(e.target.value))}

            />

            <div className="text-2xl font-bold">

                Total ₹ {calculateTotal()}

            </div>

            <button

                className="bg-blue-600 text-white px-6 py-3 rounded"

            >

                Create Invoice

            </button>

        </form>

    );

};

export default InvoiceForm;