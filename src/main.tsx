import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Hashtag } from "./pages";
import TextEditor from "./pages/TextEditor/TextEditor";

const router = createBrowserRouter([
  {
    path: "/hashtag",
    element: <Hashtag />,
  },
  {
    path: "/texteditor",
    element: <TextEditor />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);