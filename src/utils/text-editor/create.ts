import styles from "../../pages/TextEditor/TextEditor.module.css";
import { isStartWithEmptyString } from "./has";
const createSpan = (text: string) => {
  const span = document.createElement("span");

  span.setAttribute(
    "class",
    `${styles.span} ${
      isStartWithEmptyString(text) ? styles.gap : styles.normal
    }`
  );
  span.setAttribute("contentEditable", "true");
  span.innerText = text || ` `;

  return span;
};

const createLink = (text: string, type: string) => {
  const span = document.createElement("span");

  span.setAttribute(
    "class",
    `${styles.link} ${
      type === "mention"
        ? styles.mention
        : type === "hashtag"
        ? styles.hashtag
        : type === "url"
        ? styles.url
        : undefined
    }`
  );
  span.setAttribute("contentEditable", "true");
  span.innerText = text;

  return span;
};
export { createSpan, createLink };
