import React from "react";

const StatCard = ({ title, value, color }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <h3 className="text-gray-500 text-sm">

                {title}

            </h3>

            <p className={`text-4xl font-bold mt-3 ${color}`}>

                {value}

            </p>

        </div>
    );
};

export default StatCard;