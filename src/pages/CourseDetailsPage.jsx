

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useData } from "../hooks/useData";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import CourseImage from "../components/CourseImage";

function CourseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { state, dispatch, instructors, skills } = useData();

    const course = state.courses.find(
        (item) => item.id === Number(id)
    );

    if (state.loading) {
        return <p>Завантаження курсу...</p>;
    }

    if (!course) {
        return (
            <div className="course-not-found">
                <h1>Курс не знайдено</h1>

                <p>
                    Можливо, цей курс було видалено
                    або посилання неправильне.
                </p>

                <Link
                    to="/"
                    className="course-details-button"
                >
                    Повернутися до каталогу
                </Link>
            </div>
        );
    }

    const instructor = instructors.find(
        (item) => item.id === course.instructorId
    );

    const courseSkills = skills.filter(
        (skill) => course.skillIds.includes(skill.id)
    );

    function handleDelete() {
        dispatch({
            type: "ITEM_DELETED",
            payload: course.id
        });

        setShowDeleteModal(false);
        navigate("/");
    }

    return (
        <section className="course-details-page">
            <Link to="/" className="back-link">
                ← Назад до каталогу
            </Link>

            <div className="course-details-layout">
                <div className="course-details-main">
                    <div className="course-details-banner">
                        <CourseImage
                            key={course.image || "empty"}
                            src={course.image}
                            alt={`Фотографія курсу ${course.title}`}
                            className="course-details-photo"
                        />

                        {course.isPopular && (
                            <span className="popular-badge">
                                Популярний
                            </span>
                        )}
                    </div>

                    <div className="course-details-content">
                        <div className="course-tags">
                            <span className="course-level">
                                {course.level}
                            </span>

                            <span className="course-format">
                                {course.format}
                            </span>
                        </div>

                        <h1>{course.title}</h1>

                        <p className="course-details-short">
                            {course.shortDescription}
                        </p>

                        <h2>Про курс</h2>

                        <p className="course-details-description">
                            {course.description}
                        </p>

                        <h2>Навички, які ви отримаєте</h2>

                        <div className="course-skills">
                            {courseSkills.length > 0 ? (
                                courseSkills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="skill-badge"
                                    >
                                        {skill.name}
                                    </span>
                                ))
                            ) : (
                                <p>Навички не вказані.</p>
                            )}
                        </div>
                    </div>
                </div>

                <aside className="course-details-sidebar">
                    <div className="course-sidebar-card">
                        <span className="price-label">
                            Вартість навчання
                        </span>

                        <div className="details-price">
                            {course.price} грн
                        </div>

                        <div className="details-info">
                            <div>
                                <span>Викладач</span>

                                <strong>
                                    {instructor?.name ?? "Не вказано"}
                                </strong>
                            </div>

                            <div>
                                <span>Тривалість</span>

                                <strong>
                                    {course.duration} год.
                                </strong>
                            </div>

                            <div>
                                <span>Початок</span>

                                <strong>
                                    {course.startDate}
                                </strong>
                            </div>

                            <div>
                                <span>Формат</span>

                                <strong>
                                    {course.format}
                                </strong>
                            </div>

                            <div>
                                <span>Рівень</span>

                                <strong>
                                    {course.level}
                                </strong>
                            </div>

                            <div>
                                <span>Статус</span>

                                <strong>
                                    {course.isActive
                                        ? "Активний"
                                        : "Неактивний"}
                                </strong>
                            </div>
                        </div>

                        <Link
                            to={`/edit/${course.id}`}
                            className="edit-course-button"
                        >
                            Редагувати курс
                        </Link>

                        <button
                            type="button"
                            className="delete-course-button"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Видалити курс
                        </button>
                    </div>
                </aside>
            </div>

            {showDeleteModal && (
                <DeleteConfirmModal
                    courseTitle={course.title}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </section>
    );
}

export default CourseDetailsPage;
