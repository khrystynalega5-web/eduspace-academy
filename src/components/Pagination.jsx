
import { useData } from "../hooks/useData";
import { useCatalogParams } from "../hooks/useCatalogParams";

function Pagination({ totalItems }) {
    const { state } = useData();
    const { dispatchCatalog } = useCatalogParams();

    const { page, pageSize } = state;

    const totalPages = Math.max(
        1,
        Math.ceil(totalItems / pageSize)
    );

    const currentPage = Math.max(
        1,
        Math.min(page, totalPages)
    );

    const firstItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const lastItem = Math.min(
        currentPage * pageSize,
        totalItems
    );

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    function changePage(newPage) {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            newPage === currentPage
        ) {
            return;
        }

        dispatchCatalog({
            type: "PAGE_CHANGED",
            payload: newPage
        });
    }

    function changePageSize(event) {
        const newPageSize = Number(event.target.value);

        dispatchCatalog({
            type: "PAGE_SIZE_CHANGED",
            payload: newPageSize
        });
    }

    return (
        <div className="pagination-container">
            <div className="pagination-information">
                <span>
                    Показано {firstItem}–{lastItem} із {totalItems}
                </span>

                <label className="pagination-size">
                    На сторінці:

                    <select
                        value={pageSize}
                        onChange={changePageSize}
                    >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </label>
            </div>

            <nav
                className="pagination-buttons"
                aria-label="Навігація сторінками курсів"
            >
                <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                >
                    ← Попередня
                </button>

                {pages.map((pageNumber) => (
                    <button
                        key={pageNumber}
                        type="button"
                        className={
                            pageNumber === currentPage
                                ? "pagination-active"
                                : ""
                        }
                        aria-label={`Сторінка ${pageNumber}`}
                        aria-current={
                            pageNumber === currentPage
                                ? "page"
                                : undefined
                        }
                        onClick={() => changePage(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}

                <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                >
                    Наступна →
                </button>
            </nav>
        </div>
    );
}

export default Pagination;
