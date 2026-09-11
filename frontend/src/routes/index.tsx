import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Public pages (lazy loaded)
import HomePage from "../pages/Home/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // Phase 2+: /login, /register, /products, /products/:id, etc.
    ],
  },
]);

export default router;
