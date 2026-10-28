
export const initialState = {
    courses: [],
    search: "",
    filters: {
        instructorId: "",
        skillIds: [],
        minPrice: "",
        maxPrice: ""
    },
    sort: {
        field: "title",
        direction: "asc"
    },
    page: 1,
    pageSize: 6,
    loading: true
};

export function dataReducer(state, action) {
    switch (action.type) {
        case "ITEMS_LOADED":
            return {
                ...state,
                courses: action.payload,
                loading: false
            };

        case "ITEM_CREATED":
            return {
                ...state,
                courses: [...state.courses, action.payload]
            };

        case "ITEM_UPDATED":
            return {
                ...state,
                courses: state.courses.map((course) =>
                    course.id === action.payload.id
                        ? action.payload
                        : course
                )
            };

        case "ITEM_DELETED":
            return {
                ...state,
                courses: state.courses.filter(
                    (course) => course.id !== action.payload
                )
            };

        case "SEARCH_CHANGED":
            return {
                ...state,
                search: action.payload,
                page: 1
            };

        case "FILTER_CHANGED":
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload
                },
                page: 1
            };

        case "SORT_CHANGED":
            return {
                ...state,
                sort: action.payload,
                page: 1
            };

        case "PAGE_CHANGED":
            return {
                ...state,
                page: action.payload
            };

        case "PAGE_SIZE_CHANGED":
            return {
                ...state,
                pageSize: action.payload,
                page: 1
            };

        case "CATALOG_RESTORED":
            return {
                ...state,
                search: action.payload.search,
                filters: action.payload.filters,
                sort: action.payload.sort,
                page: action.payload.page,
                pageSize: action.payload.pageSize
            };

        case "FILTERS_RESET":
            return {
                ...state,
                search: "",
                filters: {
                    instructorId: "",
                    skillIds: [],
                    minPrice: "",
                    maxPrice: ""
                },
                sort: {
                    field: "title",
                    direction: "asc"
                },
                page: 1
            };

        default:
            return state;
    }
}
