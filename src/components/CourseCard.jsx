
import { Link } from "react-router";
import CourseImage from "./CourseImage";

function CourseCard({ course, instructor }) {
    return (
        <article className="course-card">
            <div className="course-card-image">
                <CourseImage
                    key={course.image || "empty"}
                    src={course.image}
                    alt={`Фотографія курсу ${course.title}`}
                    className="course-card-photo"
                />

                {course.isPopular && (
                    <span className="popular-badge">
                        Популярний
                    </span>
                )}
            </div>

            <div className="course-card-content">
                <div className="course-tags">
                    <span className="course-level">
                        {course.level}
                    </span>

                    <span className="course-format">
                        {course.format}
                    </span>
                </div>

                <h2>{course.title}</h2>

                <p className="course-description">
                    {course.shortDescription}
                </p>

                <p className="course-instructor">
                    Викладач: {instructor?.name ?? "Не вказано"}
                </p>

                <div className="course-info">
                    <span>
                        ⏱ {course.duration} год.
                    </span>

                    <span>{course.startDate}</span>
                </div>

                <div className="course-card-bottom">
                    <strong className="course-price">
                        {course.price} грн
                    </strong>

                    <Link
                        to={`/items/${course.id}`}
                        className="course-details-button"
                    >
                        Детальніше
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default CourseCard;
