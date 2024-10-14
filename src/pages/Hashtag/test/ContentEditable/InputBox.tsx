import styles from "./InputBox.module.css";

const InputBox = () => {
  const handleOnChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    const innerHTML = e.target.innerHTML;
    const innerText = e.target.innerText;
    const textContent = e.target.textContent;
    console.log("value:", value);
    console.log("innerHTML:", innerHTML);
    console.log("innerText:", innerText);
    console.log("textContent:", textContent);
  };

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    // const value = e.currentTarget.value; // 지원 안하는 듯
    const innerHTML = e.currentTarget.innerHTML;
    const innerText = e.currentTarget.innerText;
    const textContent = e.currentTarget.textContent;
    // console.log("value:", value);
    console.log("innerHTML:", innerHTML);
    console.log("innerText:", innerText);
    console.log("textContent:", textContent);
  };
  return (
    <div className="inputbox">
      <input
        type="text"
        className={styles.input}
        onChange={(e) => handleOnChange(e)}
      />
      <textarea
        className={styles.textarea}
        onChange={(e) => handleOnChange(e)}
      ></textarea>
      <div
        className={styles.contentEditable}
        contentEditable
        onInput={(e) => handleOnInput(e)}
      ></div>
    </div>
  );
};

export default InputBox;
