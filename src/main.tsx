import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TextEditor from "./pages/TextEditor/TextEditor";
import Posts from "./pages/Post/Posts";
import VideoContainer from "./pages/Video/VideoContainer";

const router = createBrowserRouter([
  {
    path: "/texteditor",
    element: <TextEditor />,
  },
  {
    path: "/post",
    element: <Posts />,
  },
  {
    path: "/video",
    element: <VideoContainer />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
