
import { useEffect, useRef, useState } from "react";

function InstructorSelect({
                              instructors,
                              value,
                              onChange,
                              onBlur,
                              invalid = false
                          }) {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listId = "instructor-options";

    const selectedInstructor = instructors.find(
        (instructor) => instructor.id === Number(value)
    );

    const [search, setSearch] = useState(
        selectedInstructor?.name ?? ""
    );
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const filteredInstructors = instructors.filter(
        (instructor) => {
            const query = search.toLocaleLowerCase("uk-UA");

            return (
                instructor.name
                    .toLocaleLowerCase("uk-UA")
                    .includes(query) ||
                instructor.specialization
                    .toLocaleLowerCase("uk-UA")
                    .includes(query)
            );
        }
    );

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearch(selectedInstructor?.name ?? "");
            }
        }

        document.addEventListener(
            "pointerdown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleOutsideClick
            );
        };
    }, [selectedInstructor?.name]);

    function handleSearchChange(event) {
        setSearch(event.target.value);
        setIsOpen(true);
        setActiveIndex(0);

        if (value !== "") {
            onChange("");
        }
    }

    function handleSelect(instructor) {
        onChange(String(instructor.id));
        setSearch(instructor.name);
        setIsOpen(false);
        setActiveIndex(0);
    }

    function handleClear() {
        onChange("");
        setSearch("");
        setIsOpen(true);
        setActiveIndex(0);
        inputRef.current?.focus();
    }

    function handleKeyDown(event) {
        if (event.key === "Escape") {
            setIsOpen(false);
            setSearch(selectedInstructor?.name ?? "");
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (!isOpen) {
                setIsOpen(true);
                setActiveIndex(0);
                return;
            }

            setActiveIndex((previous) =>
                Math.min(
                    previous + 1,
                    filteredInstructors.length - 1
                )
            );
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setActiveIndex((previous) =>
                Math.max(previous - 1, 0)
            );
        }

        if (
            event.key === "Enter" &&
            isOpen &&
            filteredInstructors.length > 0
        ) {
            event.preventDefault();

            handleSelect(
                filteredInstructors[
                    Math.max(0, activeIndex)
                    ]
            );
        }
    }

    return (
        <div
            className="instructor-select"
            ref={containerRef}
            onBlur={(event) => {
                if (
                    !event.currentTarget.contains(
                        event.relatedTarget
                    )
                ) {
                    setIsOpen(false);
                    setSearch(selectedInstructor?.name ?? "");
                    onBlur?.();
                }
            }}
        >
            <div className="instructor-select-input">
                <input
                    ref={inputRef}
                    id="instructorId"
                    name="instructorId"
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    aria-invalid={invalid}
                    autoComplete="off"
                    placeholder="Пошук викладача..."
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        setIsOpen(true);
                        setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                />

                {value !== "" && (
                    <button
                        type="button"
                        className="instructor-clear"
                        aria-label="Очистити вибір викладача"
                        onClick={handleClear}
                    >
                        ×
                    </button>
                )}
            </div>

            {isOpen && (
                <ul
                    id={listId}
                    className="instructor-options"
                    role="listbox"
                >
                    {filteredInstructors.length === 0 ? (
                        <li className="instructor-no-results">
                            Викладачів не знайдено
                        </li>
                    ) : (
                        filteredInstructors.map(
                            (instructor, index) => (
                                <li
                                    key={instructor.id}
                                    id={`instructor-option-${instructor.id}`}
                                    role="option"
                                    aria-selected={
                                        Number(value) === instructor.id
                                    }
                                    className={
                                        index === activeIndex
                                            ? "instructor-option active"
                                            : "instructor-option"
                                    }
                                    onMouseDown={(event) =>
                                        event.preventDefault()
                                    }
                                    onClick={() =>
                                        handleSelect(instructor)
                                    }
                                >
                                    <strong>
                                        {instructor.name}
                                    </strong>

                                    <span>
                                        {instructor.specialization}
                                    </span>
                                </li>
                            )
                        )
                    )}
                </ul>
            )}
        </div>
    );
}

export default InstructorSelect;
