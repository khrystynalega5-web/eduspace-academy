
import { useEffect, useRef } from "react";

function UnsavedChangesModal({ onStay, onLeave }) {
    const stayButtonRef = useRef(null);

    useEffect(() => {
        stayButtonRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onStay();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onStay]);

    return (
        <div className="modal-overlay">
            <div
                className="modal-content"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="unsaved-title"
                aria-describedby="unsaved-description"
            >
                <div className="modal-icon">⚠️</div>

                <h2 id="unsaved-title">
                    Незбережені зміни
                </h2>

                <p id="unsaved-description">
                    Ви змінили дані курсу, але ще не зберегли їх.
                    Якщо залишите сторінку, зміни буде втрачено.
                </p>

                <div className="modal-actions">
                    <button
                        ref={stayButtonRef}
                        type="button"
                        className="modal-cancel-button"
                        onClick={onStay}
                    >
                        Залишитися
                    </button>

                    <button
                        type="button"
                        className="modal-delete-button"
                        onClick={onLeave}
                    >
                        Вийти без збереження
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UnsavedChangesModal;
