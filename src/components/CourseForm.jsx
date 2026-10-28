
import { useMemo, useRef, useState } from "react";
import { useData } from "../hooks/useData";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import UnsavedChangesModal from "./UnsavedChangesModal";
import ImageUpload from "./ImageUpload";
import InstructorSelect from "./InstructorSelect";

const emptyCourse = {
    title: "",
    shortDescription: "",
    description: "",
    price: "",
    duration: "",
    startDate: "",
    level: "Початковий",
    format: "Онлайн",
    isPopular: false,
    isActive: true,
    instructorId: "",
    skillIds: [],
    image: ""
};

function validateCourse(form, courses, currentId) {
    const errors = {};

    const title = form.title.trim();
    const shortDescription = form.shortDescription.trim();
    const description = form.description.trim();

    if (title.length < 5) {
        errors.title = "Назва повинна містити мінімум 5 символів";
    } else if (title.length > 100) {
        errors.title = "Назва не може перевищувати 100 символів";
    } else {
        const duplicate = courses.some(
            (course) =>
                course.id !== currentId &&
                course.title.trim().toLocaleLowerCase("uk-UA") ===
                title.toLocaleLowerCase("uk-UA")
        );

        if (duplicate) {
            errors.title = "Курс із такою назвою вже існує";
        }
    }

    if (shortDescription.length < 10) {
        errors.shortDescription =
            "Короткий опис повинен містити мінімум 10 символів";
    } else if (shortDescription.length > 200) {
        errors.shortDescription =
            "Короткий опис не може перевищувати 200 символів";
    }

    if (description.length < 20) {
        errors.description =
            "Повний опис повинен містити мінімум 20 символів";
    }

    if (
        form.price === "" ||
        !Number.isFinite(Number(form.price)) ||
        Number(form.price) <= 0
    ) {
        errors.price = "Введіть ціну, більшу за 0";
    }

    if (
        form.duration === "" ||
        !Number.isInteger(Number(form.duration)) ||
        Number(form.duration) < 1 ||
        Number(form.duration) > 500
    ) {
        errors.duration =
            "Тривалість повинна бути цілим числом від 1 до 500";
    }

    if (
        !form.startDate ||
        !/^\d{4}-\d{2}-\d{2}$/.test(form.startDate) ||
        Number.isNaN(Date.parse(form.startDate))
    ) {
        errors.startDate = "Оберіть коректну дату початку";
    }

    if (!form.instructorId) {
        errors.instructorId = "Оберіть викладача";
    }

    if (!form.skillIds.length) {
        errors.skillIds = "Оберіть хоча б одну навичку";
    }

    return errors;
}

function CourseForm({ initialCourse, onSubmit }) {
    const { state, instructors, skills } = useData();

    const formRef = useRef(null);

    const originalForm = useMemo(() => {
        return initialCourse
            ? {
                ...initialCourse,
                skillIds: [...initialCourse.skillIds]
            }
            : {
                ...emptyCourse,
                skillIds: []
            };
    }, [initialCourse]);

    const [form, setForm] = useState(() => ({
        ...originalForm,
        skillIds: [...originalForm.skillIds]
    }));

    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const isDirty =
        JSON.stringify(form) !== JSON.stringify(originalForm);

    const {
        blocker,
        allowSaveNavigation
    } = useUnsavedChanges(isDirty);

    const errors = validateCourse(
        form,
        state.courses,
        initialCourse?.id
    );

    const isValid = Object.keys(errors).length === 0;

    function showError(name) {
        return (touched[name] || submitted) && errors[name];
    }

    function handleBlur(event) {
        const name = event.target.name;

        setTouched((previous) => ({
            ...previous,
            [name]: true
        }));
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function handleSkillChange(skillId) {
        setForm((previous) => ({
            ...previous,
            skillIds: previous.skillIds.includes(skillId)
                ? previous.skillIds.filter((id) => id !== skillId)
                : [...previous.skillIds, skillId]
        }));

        setTouched((previous) => ({
            ...previous,
            skillIds: true
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (imageLoading) {
            return;
        }

        setSubmitted(true);

        const currentErrors = validateCourse(
            form,
            state.courses,
            initialCourse?.id
        );

        const firstError = Object.keys(currentErrors)[0];

        if (firstError) {
            const firstField = Array.from(
                formRef.current.elements
            ).find((element) => element.name === firstError);

            firstField?.focus();
            return;
        }

        allowSaveNavigation();

        onSubmit({
            ...form,
            title: form.title.trim(),
            shortDescription: form.shortDescription.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            duration: Number(form.duration),
            instructorId: Number(form.instructorId)
        });
    }

    return (
        <>
            <form
                ref={formRef}
                className="course-form"
                onSubmit={handleSubmit}
                noValidate
            >
                <h2>Основна інформація</h2>

                <div className="form-group">
                    <label htmlFor="title">Назва курсу *</label>

                    <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(showError("title"))}
                    />

                    {showError("title") && (
                        <p className="form-error">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="shortDescription">
                        Короткий опис *
                    </label>

                    <input
                        id="shortDescription"
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(
                            showError("shortDescription")
                        )}
                    />

                    {showError("shortDescription") && (
                        <p className="form-error">
                            {errors.shortDescription}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        Повний опис *
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows="5"
                        value={form.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(
                            showError("description")
                        )}
                    />

                    {showError("description") && (
                        <p className="form-error">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">
                            Ціна (грн) *
                        </label>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(
                                showError("price")
                            )}
                        />

                        {showError("price") && (
                            <p className="form-error">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">
                            Тривалість (години) *
                        </label>

                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            min="1"
                            max="500"
                            value={form.duration}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            aria-invalid={Boolean(
                                showError("duration")
                            )}
                        />

                        {showError("duration") && (
                            <p className="form-error">
                                {errors.duration}
                            </p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">
                        Дата початку *
                    </label>

                    <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(
                            showError("startDate")
                        )}
                    />

                    {showError("startDate") && (
                        <p className="form-error">
                            {errors.startDate}
                        </p>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="level">
                            Рівень
                        </label>

                        <select
                            id="level"
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                        >
                            <option value="Початковий">
                                Початковий
                            </option>

                            <option value="Середній">
                                Середній
                            </option>

                            <option value="Просунутий">
                                Просунутий
                            </option>
                        </select>
                    </div>

                    <fieldset className="form-group form-radio-group">
                        <legend>Формат навчання</legend>

                        {["Онлайн", "Офлайн", "Змішаний"].map(
                            (format) => (
                                <label
                                    key={format}
                                    className="checkbox-label"
                                >
                                    <input
                                        type="radio"
                                        name="format"
                                        value={format}
                                        checked={form.format === format}
                                        onChange={handleChange}
                                    />

                                    {format}
                                </label>
                            )
                        )}
                    </fieldset>
                </div>

                <h2>Викладач та навички</h2>

                <div className="form-group">
                    <label htmlFor="instructorId">
                        Викладач *
                    </label>

                    <InstructorSelect
                        instructors={instructors}
                        value={form.instructorId}
                        onChange={(value) => {
                            setForm((previous) => ({
                                ...previous,
                                instructorId: value
                            }));
                        }}
                        onBlur={() => {
                            setTouched((previous) => ({
                                ...previous,
                                instructorId: true
                            }));
                        }}
                        invalid={Boolean(
                            showError("instructorId")
                        )}
                    />

                    {showError("instructorId") && (
                        <p className="form-error">
                            {errors.instructorId}
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>Навички *</label>

                    <div className="skills-checkboxes">
                        {skills.map((skill) => (
                            <label
                                key={skill.id}
                                className="checkbox-label"
                            >
                                <input
                                    type="checkbox"
                                    name="skillIds"
                                    checked={form.skillIds.includes(
                                        skill.id
                                    )}
                                    onChange={() =>
                                        handleSkillChange(skill.id)
                                    }
                                />

                                {skill.name}
                            </label>
                        ))}
                    </div>

                    {showError("skillIds") && (
                        <p className="form-error">
                            {errors.skillIds}
                        </p>
                    )}
                </div>

                <ImageUpload
                    value={form.image}
                    onChange={(image) => {
                        setForm((previous) => ({
                            ...previous,
                            image
                        }));
                    }}
                    onLoadingChange={setImageLoading}
                />

                <h2>Додаткові налаштування</h2>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isPopular"
                            checked={form.isPopular}
                            onChange={handleChange}
                        />

                        Популярний курс
                    </label>
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                        />

                        Активний курс
                    </label>
                </div>

                <button
                    type="submit"
                    className="form-submit-button"
                    disabled={imageLoading || (submitted && !isValid)}
                >
                    {imageLoading
                        ? "Завантаження фотографії..."
                        : initialCourse
                            ? "Зберегти зміни"
                            : "Створити курс"}
                </button>
            </form>

            {blocker.state === "blocked" && (
                <UnsavedChangesModal
                    onStay={() => blocker.reset()}
                    onLeave={() => blocker.proceed()}
                />
            )}
        </>
    );
}

export default CourseForm;
