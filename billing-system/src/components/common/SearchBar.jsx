const SearchBar = ({ value, onChange }) => {

    return (

        <input

            type="text"

            placeholder="Search..."

            value={value}

            onChange={(e)=>onChange(e.target.value)}

            className="border rounded-lg p-3 w-72"

        />

    );

};

export default SearchBar;