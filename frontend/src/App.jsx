import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
/>
        <Route element={<MainLayout />}>
          <Route path="/resources" element={<Resources />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;