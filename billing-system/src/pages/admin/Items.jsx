import { useEffect, useState } from "react";

import {

    getItems,

    addItem,

    updateItem,

    deleteItem

} from "../../api/itemApi";

import {

    getCategories

} from "../../api/categoryApi";

import DataTable from "../../components/common/DataTable";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ItemForm from "../../components/forms/ItemForm";

const Items = () => {

    const [items, setItems] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const itemRes = await getItems();

            const categoryRes = await getCategories();

            setItems(itemRes.data || []);

            setCategories(categoryRes.data || []);

        }

        finally {

            setLoading(false);

        }

    };

    const handleSave = async (data) => {

        try {

            if (selectedItem) {

                await updateItem(selectedItem.id, data);

            }

            else {

                await addItem(data);

            }

            setModalOpen(false);

            setSelectedItem(null);

            loadData();

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async () => {

        await deleteItem(deleteId);

        setDeleteId(null);

        loadData();

    };

    const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Loader />;

    return (

        <div>

            <div className="flex justify-between mb-6">

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />

                <Button
                    onClick={() => {

                        setSelectedItem(null);

                        setModalOpen(true);

                    }}
                >

                    Add Item

                </Button>

            </div>

            <DataTable

                columns={["ID", "Item"]}

                data={filtered}

                renderActions={(item)=>(

                    <>

                        <Button

                            variant="warning"

                            onClick={()=>{

                                setSelectedItem(item);

                                setModalOpen(true);

                            }}

                        >

                            Edit

                        </Button>

                        <Button

                            variant="danger"

                            onClick={()=>setDeleteId(item.id)}

                        >

                            Delete

                        </Button>

                    </>

                )}

            />

            <Modal

                open={modalOpen}

                title={selectedItem ? "Edit Item" : "Add Item"}

                onClose={() => {

                    setModalOpen(false);

                    setSelectedItem(null);

                }}

            >

                <ItemForm

                    initialData={selectedItem}

                    categories={categories}

                    onSubmit={handleSave}

                />

            </Modal>

            <ConfirmDialog

                open={deleteId!==null}

                onClose={()=>setDeleteId(null)}

                onConfirm={handleDelete}

                title="Delete Item"

                message="Delete this item permanently?"

            />

        </div>

    );

};

export default Items;