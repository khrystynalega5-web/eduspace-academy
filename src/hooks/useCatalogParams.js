
import { useSearchParams } from "react-router";
import { useData } from "./useData";

export function readCatalogParams(params) {
    const page = Number(params.get("page"));
    const size = Number(params.get("size"));

    const sortField = params.get("sort");
    const sortDirection = params.get("order");

    const skills = (params.get("skills") || "")
        .split(",")
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);

    return {
        search: params.get("search") || "",

        filters: {
            instructorId: params.get("instructor") || "",
            skillIds: skills,
            minPrice: params.get("minPrice") || "",
            maxPrice: params.get("maxPrice") || ""
        },

        sort: {
            field: ["title", "price", "duration"].includes(sortField)
                ? sortField
                : "title",

            direction: ["asc", "desc"].includes(sortDirection)
                ? sortDirection
                : "asc"
        },

        page: Number.isInteger(page) && page > 0 ? page : 1,

        pageSize: [6, 12, 24].includes(size) ? size : 6
    };
}

export function useCatalogParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { dispatch } = useData();

    function dispatchCatalog(action) {
        const params = new URLSearchParams(searchParams);

        switch (action.type) {
            case "SEARCH_CHANGED":
                if (action.payload) {
                    params.set("search", action.payload);
                } else {
                    params.delete("search");
                }
                params.delete("page");
                break;

            case "FILTER_CHANGED": {
                const fieldNames = {
                    instructorId: "instructor",
                    skillIds: "skills",
                    minPrice: "minPrice",
                    maxPrice: "maxPrice"
                };

                Object.entries(action.payload).forEach(([key, value]) => {
                    const paramName = fieldNames[key];

                    if (!paramName) return;

                    const text = Array.isArray(value)
                        ? value.join(",")
                        : String(value);

                    if (text) {
                        params.set(paramName, text);
                    } else {
                        params.delete(paramName);
                    }
                });

                params.delete("page");
                break;
            }

            case "SORT_CHANGED":
                params.set("sort", action.payload.field);
                params.set("order", action.payload.direction);
                params.delete("page");
                break;

            case "PAGE_CHANGED":
                params.set("page", String(action.payload));
                break;

            case "PAGE_SIZE_CHANGED":
                params.set("size", String(action.payload));
                params.delete("page");
                break;

            case "FILTERS_RESET":
                params.delete("search");
                params.delete("instructor");
                params.delete("skills");
                params.delete("minPrice");
                params.delete("maxPrice");
                params.delete("sort");
                params.delete("order");
                params.delete("page");
                break;

            default:
                dispatch(action);
                return;
        }

        dispatch(action);

        setSearchParams(params, {
            replace: action.type === "SEARCH_CHANGED",
            preventScrollReset: true
        });
    }

    return { searchParams, dispatchCatalog };
}
