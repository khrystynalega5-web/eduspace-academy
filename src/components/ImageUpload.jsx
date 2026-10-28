
import { useRef, useState } from "react";
import CourseImage from "./CourseImage";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

function ImageUpload({ value, onChange, onLoadingChange }) {
    const inputRef = useRef(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function updateLoading(value) {
        setLoading(value);
        onLoadingChange(value);
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError("Дозволено лише JPEG, PNG та WebP.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Розмір фотографії не повинен перевищувати 2 МБ.");
            event.target.value = "";
            return;
        }

        updateLoading(true);

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                onChange(reader.result);
            } else {
                setError("Не вдалося прочитати фотографію.");
            }

            updateLoading(false);
        };

        reader.onerror = () => {
            setError("Помилка читання файлу.");
            updateLoading(false);
        };

        reader.readAsDataURL(file);

        event.target.value = "";
    }

    function handleRemove() {
        onChange("");
        setError("");

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="image-upload">
            <h2>Фотографія курсу</h2>

            <div className="image-upload-preview">
                <CourseImage
                    key={value || "empty"}
                    src={value}
                    alt="Попередній перегляд фотографії курсу"
                    className="course-upload-image"
                />
            </div>

            <label htmlFor="course-image">
                Оберіть фотографію
            </label>

            <input
                ref={inputRef}
                id="course-image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                disabled={loading}
            />

            <p className="image-upload-hint">
                Формати: JPEG, PNG, WebP. Максимум 2 МБ.
            </p>

            {loading && (
                <p role="status">Завантаження фотографії...</p>
            )}

            {error && (
                <p className="form-error" role="alert">
                    {error}
                </p>
            )}

            {value && (
                <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemove}
                    disabled={loading}
                >
                    Видалити фотографію
                </button>
            )}
        </div>
    );
}

export default ImageUpload;
