
import { useNavigate } from "react-router";
import { useData } from "../hooks/useData";
import CourseForm from "../components/CourseForm";

function CreateCoursePage() {
    const { state, dispatch } = useData();
    const navigate = useNavigate();

    function handleCreate(courseData) {
        const newId = Math.max(
            0,
            ...state.courses.map((course) => course.id)
        ) + 1;

        const newCourse = {
            ...courseData,
            id: newId
        };

        dispatch({
            type: "ITEM_CREATED",
            payload: newCourse
        });

        navigate(`/items/${newId}`);
    }

    return (
        <section className="course-form-page">
            <h1>Створення нового курсу</h1>
            <p>Заповніть інформацію про навчальний курс.</p>

            <CourseForm onSubmit={handleCreate} />
        </section>
    );
}

export default CreateCoursePage;
