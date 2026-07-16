const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false
}) => {

    const styles = {
        primary: "bg-blue-600 hover:bg-blue-700",
        success: "bg-green-600 hover:bg-green-700",
        danger: "bg-red-600 hover:bg-red-700",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        secondary: "bg-gray-600 hover:bg-gray-700"
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-white transition ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {children}
        </button>
    );
};

export default Button;