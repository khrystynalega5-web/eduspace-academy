
import { Routes, Route } from "react-router";

import Layout from "./components/Layout";

import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CoursesPage />} />
          <Route path="/items/:id" element={<CourseDetailsPage />} />
          <Route path="/create" element={<CreateCoursePage />} />
          <Route path="/edit/:id" element={<EditCoursePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
  );
}

export default App;


