const DataTable = ({ columns, data, renderActions }) => {

    return (

        <table className="w-full bg-white rounded-xl shadow">

            <thead>

                <tr className="bg-slate-200">

                    {columns.map((column) => (

                        <th
                            key={column}
                            className="p-3 text-left"
                        >
                            {column}
                        </th>

                    ))}

                    <th className="p-3">

                        Actions

                    </th>

                </tr>

            </thead>

            <tbody>

                {data.map((row) => (

                    <tr
                        key={row.id}
                        className="border-t"
                    >

                        {Object.keys(row).map((key)=>{

                            if(key==="id" || key==="name"){

                                return(

                                    <td
                                        key={key}
                                        className="p-3"
                                    >
                                        {row[key]}
                                    </td>

                                );

                            }

                            return null;

                        })}

                        <td className="space-x-2">

                            {renderActions(row)}

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

};

export default DataTable;