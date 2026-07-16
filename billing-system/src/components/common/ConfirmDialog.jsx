import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message
}) => {

    return (

        <Modal
            open={open}
            onClose={onClose}
            title={title}
        >

            <p className="mb-6">

                {message}

            </p>

            <div className="flex justify-end gap-3">

                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="danger"
                    onClick={onConfirm}
                >
                    Delete
                </Button>

            </div>

        </Modal>

    );

};

export default ConfirmDialog;