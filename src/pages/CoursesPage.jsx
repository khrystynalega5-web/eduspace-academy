
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import { useData } from "../hooks/useData";
import { readCatalogParams } from "../hooks/useCatalogParams";
import { useCatalogParams } from "../hooks/useCatalogParams";

import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import Pagination from "../components/Pagination";

function CoursesPage() {
    const { state, dispatch, instructors } = useData();
    const [searchParams] = useSearchParams();
    const { dispatchCatalog } = useCatalogParams();

    const urlParams = searchParams.toString();

    useEffect(() => {
        dispatch({
            type: "CATALOG_RESTORED",
            payload: readCatalogParams(
                new URLSearchParams(urlParams)
            )
        });
    }, [urlParams, dispatch]);

    const filteredCourses = useMemo(() => {
        const search = state.search
            .trim()
            .toLocaleLowerCase("uk-UA");

        const result = state.courses.filter((course) => {
            const title = course.title
                .toLocaleLowerCase("uk-UA");

            const description = (
                course.description + " " + course.shortDescription
            ).toLocaleLowerCase("uk-UA");

            const matchesSearch =
                title.includes(search) ||
                description.includes(search);

            const matchesInstructor =
                state.filters.instructorId === "" ||
                course.instructorId ===
                Number(state.filters.instructorId);

            const matchesSkills =
                state.filters.skillIds.length === 0 ||
                state.filters.skillIds.some((skillId) =>
                    course.skillIds.includes(skillId)
                );

            const matchesMinPrice =
                state.filters.minPrice === "" ||
                course.price >= Number(state.filters.minPrice);

            const matchesMaxPrice =
                state.filters.maxPrice === "" ||
                course.price <= Number(state.filters.maxPrice);

            return (
                matchesSearch &&
                matchesInstructor &&
                matchesSkills &&
                matchesMinPrice &&
                matchesMaxPrice
            );
        });

        result.sort((a, b) => {
            const { field, direction } = state.sort;

            let comparison = 0;

            if (field === "title") {
                comparison = a.title.localeCompare(
                    b.title,
                    "uk"
                );
            }

            if (field === "price") {
                comparison = a.price - b.price;
            }

            if (field === "duration") {
                comparison = a.duration - b.duration;
            }

            if (comparison === 0) {
                comparison = a.id - b.id;
            }

            return direction === "asc"
                ? comparison
                : -comparison;
        });

        return result;
    }, [
        state.courses,
        state.search,
        state.filters,
        state.sort
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCourses.length / state.pageSize)
    );

    const currentPage = Math.max(
        1,
        Math.min(state.page, totalPages)
    );

    useEffect(() => {
        if (state.page > totalPages) {
            dispatchCatalog({
                type: "PAGE_CHANGED",
                payload: totalPages
            });
        }
    }, [state.page, totalPages]);

    const visibleCourses = useMemo(() => {
        const startIndex =
            (currentPage - 1) * state.pageSize;

        const endIndex = startIndex + state.pageSize;

        return filteredCourses.slice(
            startIndex,
            endIndex
        );
    }, [
        filteredCourses,
        currentPage,
        state.pageSize
    ]);

    if (state.loading) {
        return <p>Завантаження курсів...</p>;
    }

    return (
        <section className="courses-page">
            <div className="courses-heading">
                <div>
                    <span className="section-label">
                        НАВЧАЙСЯ З EDUSPACE
                    </span>

                    <h1>Каталог навчальних курсів</h1>

                    <p>
                        Обирай цікаві курси, розвивай навички
                        та відкривай нові можливості.
                    </p>
                </div>

                <div className="courses-count">
                    Усього курсів: {state.courses.length}
                </div>
            </div>

            <CourseFilters />

            <div className="courses-results">
                <h2>Доступні курси</h2>

                <p>
                    Знайдено курсів: {filteredCourses.length}
                </p>
            </div>

            {filteredCourses.length === 0 ? (
                <div className="courses-empty">
                    <div className="empty-icon">🔎</div>

                    <h2>Курсів не знайдено</h2>

                    <p>
                        Спробуйте змінити пошуковий запит
                        або налаштування фільтрів.
                    </p>
                </div>
            ) : (
                <div className="courses-grid">
                    {visibleCourses.map((course) => {
                        const instructor = instructors.find(
                            (item) =>
                                item.id === course.instructorId
                        );

                        return (
                            <CourseCard
                                key={course.id}
                                course={course}
                                instructor={instructor}
                            />
                        );
                    })}
                </div>
            )}

            <Pagination
                totalItems={filteredCourses.length}
            />
        </section>
    );
}

export default CoursesPage;
