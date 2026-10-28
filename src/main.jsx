
import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router";

import App from "./App";
import DataProvider from "./context/DataProvider";

import "./index.css";
import "./styles/Layout.css";
import "./styles/Courses.css";
import "./styles/CourseDetails.css";
import "./styles/CourseForm.css";
import "./styles/Modal.css";
import "./styles/CourseFilters.css";
import "./styles/Pagination.css";
import "./styles/ImageUpload.css";
import "./styles/InstructorSelect.css";


const router = createBrowserRouter([
    {
        path: "/*",
        element: <App />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <DataProvider>
            <RouterProvider router={router} />
        </DataProvider>
    </React.StrictMode>
);
