import styles from "./index.module.css";
import ReactDOM from "react-dom";

const CommonModal = (props) => {
  return ReactDOM.createPortal(
    <div className={styles.overlayContainer}>
      <div
        className={
          styles.container +
          " animate__animated animate__slideInUp animate__faster"
        }
      >
        {props.children}
      </div>
    </div>,
    document.body
  );
};

export default CommonModal;
