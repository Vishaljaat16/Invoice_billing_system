import { useEffect, useState } from "react";

import {
    getCategories,
    deleteCategory
} from "../../api/categoryApi";

import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const Categories = () => {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [deleteId, setDeleteId] = useState(null);

    const fetchCategories = async () => {

        try {

            setLoading(true);

            const response = await getCategories();

            setCategories(response.data || []);

        }

        catch(err){

            console.log(err);

        }

        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        fetchCategories();

    },[]);

    const handleDelete=async()=>{

        try{

            await deleteCategory(deleteId);

            setDeleteId(null);

            fetchCategories();

        }

        catch(err){

            console.log(err);

        }

    };

    const filtered = categories.filter(category=>{

        return category.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

    });

    if(loading){

        return <Loader/>

    }

    return(

        <div>

            <div className="flex justify-between mb-6">

                <SearchBar

                    value={search}

                    onChange={setSearch}

                />

                <Button>

                    Add Category

                </Button>

            </div>

            <DataTable

                columns={["ID","Category"]}

                data={filtered}

                renderActions={(row)=>(

                    <>

                        <Button variant="warning">

                            Edit

                        </Button>

                        <Button

                            variant="danger"

                            onClick={()=>setDeleteId(row.id)}

                        >

                            Delete

                        </Button>

                    </>

                )}

            />

            <ConfirmDialog

                open={deleteId!==null}

                onClose={()=>setDeleteId(null)}

                onConfirm={handleDelete}

                title="Delete Category"

                message="Are you sure you want to delete this category?"

            />

        </div>

    );

};

export default Categories;