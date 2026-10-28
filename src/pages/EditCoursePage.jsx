
import { Link, useNavigate, useParams } from "react-router";

import { useData } from "../hooks/useData";
import CourseForm from "../components/CourseForm";

function EditCoursePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { state, dispatch } = useData();

    if (state.loading) {
        return <p>Завантаження курсу...</p>;
    }

    const course = state.courses.find(
        (item) => item.id === Number(id)
    );

    if (!course) {
        return (
            <div className="course-not-found">
                <h1>Курс не знайдено</h1>
                <Link to="/">Повернутися до каталогу</Link>
            </div>
        );
    }

    function handleUpdate(updatedCourse) {
        dispatch({
            type: "ITEM_UPDATED",
            payload: {
                ...updatedCourse,
                id: course.id
            }
        });

        navigate(`/items/${course.id}`);
    }

    return (
        <section className="course-form-page">
            <h1>Редагування курсу</h1>
            <p>Змініть необхідні дані та збережіть результат.</p>

            <CourseForm
                initialCourse={course}
                onSubmit={handleUpdate}
            />
        </section>
    );
}

export default EditCoursePage;
