
import { useEffect, useReducer } from "react";

import { DataContext } from "./DataContext";
import { dataReducer, initialState } from "./dataReducer";

import { initialCourses } from "../data/courses";
import { instructors } from "../data/instructors";
import { skills } from "../data/skills";

const STORAGE_KEY = "eduspace-courses";

function loadCourses() {
    try {
        const savedCourses = localStorage.getItem(STORAGE_KEY);

        if (savedCourses !== null) {
            const parsedCourses = JSON.parse(savedCourses);

            if (Array.isArray(parsedCourses)) {
                return parsedCourses;
            }
        }
    } catch (error) {
        console.error("Помилка завантаження курсів:", error);
    }

    return initialCourses;
}

function DataProvider({ children }) {
    const [state, dispatch] = useReducer(dataReducer, initialState);

    useEffect(() => {
        dispatch({
            type: "ITEMS_LOADED",
            payload: loadCourses()
        });
    }, []);

    useEffect(() => {
        if (!state.loading) {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(state.courses)
                );
            } catch (error) {
                console.error("Помилка збереження курсів:", error);
            }
        }
    }, [state.courses, state.loading]);

    const value = {
        state,
        dispatch,
        instructors,
        skills
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export default DataProvider;
