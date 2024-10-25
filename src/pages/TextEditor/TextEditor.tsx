import te from "./TextEditor.module.css";

const TextEditor = () => {
  return (
    <div className="text-editor">
      <div className={te.content}>
        <div className={te.line}>
          <span>
            <span className={te.normal} contentEditable></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
