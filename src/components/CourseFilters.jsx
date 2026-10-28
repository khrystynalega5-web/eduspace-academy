
import { useEffect, useState } from "react";
import { useData } from "../hooks/useData";
import { useDebounce } from "../hooks/useDebounce";
import { useCatalogParams } from "../hooks/useCatalogParams";

function CourseFilters() {
    const { state, instructors, skills } = useData();
    const { dispatchCatalog } = useCatalogParams();

    const [searchInput, setSearchInput] = useState(state.search);
    const debouncedSearch = useDebounce(searchInput, 300);

    useEffect(() => {
        if (debouncedSearch !== state.search) {
            dispatchCatalog({
                type: "SEARCH_CHANGED",
                payload: debouncedSearch
            });
        }
    }, [debouncedSearch, state.search, dispatchCatalog]);

    function handleFilterChange(name, value) {
        dispatchCatalog({
            type: "FILTER_CHANGED",
            payload: {
                [name]: value
            }
        });
    }

    function handleSkillChange(skillId) {
        const selectedSkills = state.filters.skillIds;

        const updatedSkills = selectedSkills.includes(skillId)
            ? selectedSkills.filter((id) => id !== skillId)
            : [...selectedSkills, skillId];

        handleFilterChange("skillIds", updatedSkills);
    }

    function handleSortChange(field, direction) {
        dispatchCatalog({
            type: "SORT_CHANGED",
            payload: {
                field,
                direction
            }
        });
    }

    function handleSearchClear() {
        setSearchInput("");

        dispatchCatalog({
            type: "SEARCH_CHANGED",
            payload: ""
        });
    }

    function handleReset() {
        setSearchInput("");

        dispatchCatalog({
            type: "FILTERS_RESET"
        });
    }

    return (
        <div className="course-filters">
            <div className="filters-top">
                <h2>Знайди свій курс</h2>

                <button
                    type="button"
                    className="reset-filters-button"
                    onClick={handleReset}
                >
                    Очистити фільтри
                </button>
            </div>

            <div className="filters-search">
                <label htmlFor="course-search">
                    Пошук курсів
                </label>

                <div className="search-input-wrapper">
                    <input
                        id="course-search"
                        type="search"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(event.target.value)
                        }
                        placeholder="Наприклад, React або Python..."
                    />

                    {searchInput && (
                        <button
                            type="button"
                            className="clear-search-button"
                            aria-label="Очистити пошук"
                            onClick={handleSearchClear}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="filters-grid">
                <div className="filter-field">
                    <label htmlFor="instructor-filter">
                        Викладач
                    </label>

                    <select
                        id="instructor-filter"
                        value={state.filters.instructorId}
                        onChange={(event) =>
                            handleFilterChange(
                                "instructorId",
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Усі викладачі
                        </option>

                        {instructors.map((instructor) => (
                            <option
                                key={instructor.id}
                                value={instructor.id}
                            >
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="sort-field">
                        Сортувати за
                    </label>

                    <select
                        id="sort-field"
                        value={state.sort.field}
                        onChange={(event) =>
                            handleSortChange(
                                event.target.value,
                                state.sort.direction
                            )
                        }
                    >
                        <option value="title">
                            Назвою
                        </option>

                        <option value="price">
                            Ціною
                        </option>

                        <option value="duration">
                            Тривалістю
                        </option>
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="sort-direction">
                        Напрям сортування
                    </label>

                    <select
                        id="sort-direction"
                        value={state.sort.direction}
                        onChange={(event) =>
                            handleSortChange(
                                state.sort.field,
                                event.target.value
                            )
                        }
                    >
                        <option value="asc">
                            За зростанням (А–Я)
                        </option>

                        <option value="desc">
                            За спаданням (Я–А)
                        </option>
                    </select>
                </div>

                <div className="filter-field">
                    <label htmlFor="min-price">
                        Ціна від (грн)
                    </label>

                    <input
                        id="min-price"
                        type="number"
                        min="0"
                        value={state.filters.minPrice}
                        onChange={(event) =>
                            handleFilterChange(
                                "minPrice",
                                event.target.value
                            )
                        }
                        placeholder="Мінімальна"
                    />
                </div>

                <div className="filter-field">
                    <label htmlFor="max-price">
                        Ціна до (грн)
                    </label>

                    <input
                        id="max-price"
                        type="number"
                        min="0"
                        value={state.filters.maxPrice}
                        onChange={(event) =>
                            handleFilterChange(
                                "maxPrice",
                                event.target.value
                            )
                        }
                        placeholder="Максимальна"
                    />
                </div>
            </div>

            <div className="skills-filter">
                <h3>Навички</h3>

                <p>
                    Можна вибрати декілька навичок одночасно.
                </p>

                <div className="filter-skills-list">
                    {skills.map((skill) => (
                        <label
                            key={skill.id}
                            className="filter-skill-option"
                        >
                            <input
                                type="checkbox"
                                checked={state.filters.skillIds.includes(
                                    skill.id
                                )}
                                onChange={() =>
                                    handleSkillChange(skill.id)
                                }
                            />

                            <span>{skill.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CourseFilters;
