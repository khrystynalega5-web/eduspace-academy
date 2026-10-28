
import { useEffect, useRef } from "react";

function DeleteConfirmModal({ courseTitle, onConfirm, onCancel }) {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        cancelButtonRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onCancel();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onCancel]);

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-icon">🗑️</div>

                <h2 id="delete-modal-title">
                    Видалити курс?
                </h2>

                <p>
                    Ви впевнені, що хочете видалити курс
                    <strong> «{courseTitle}»</strong>?
                </p>

                <p className="modal-warning">
                    Цю дію неможливо скасувати.
                </p>

                <div className="modal-actions">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        className="modal-cancel-button"
                        onClick={onCancel}
                    >
                        Скасувати
                    </button>

                    <button
                        type="button"
                        className="modal-delete-button"
                        onClick={onConfirm}
                    >
                        Так, видалити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
