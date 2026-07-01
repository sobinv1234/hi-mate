import React from "react";

const ConfirmModal = ({
    show,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) => {
    if (!show) return null;

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onCancel}
                            />
                        </div>

                        <div className="modal-body">
                            {message}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                {cancelText}
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Backdrop */}
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ConfirmModal;