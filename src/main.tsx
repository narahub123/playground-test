import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TextEditor from "./pages/TextEditor/TextEditor";
import Post from "./pages/Post/Post";

const router = createBrowserRouter([
  {
    path: "/texteditor",
    element: <TextEditor />,
  },
  {
    path: "/post",
    element: <Post />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
