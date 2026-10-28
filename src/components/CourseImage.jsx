
import { useState } from "react";

function CourseImage({ src, alt, className = "" }) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div className={`image-placeholder ${className}`}>
                <span role="img" aria-label="Навчальний курс">
                    🎓
                </span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setHasError(true)}
        />
    );
}

export default CourseImage;
