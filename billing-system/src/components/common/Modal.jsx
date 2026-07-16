export default function Modal({

    open,

    onClose,

    title,

    children

}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

            <div className="bg-white rounded-xl w-[450px] p-6">

                <div className="flex justify-between mb-5">

                    <h2 className="text-xl font-bold">

                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                    >

                        ✕

                    </button>

                </div>

                {children}

            </div>

        </div>

    );

}