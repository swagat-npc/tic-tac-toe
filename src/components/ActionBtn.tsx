import type { ActionBtnProps } from "../types/Prop";
import "./ActionBtn.css";

const ActionBtn = ({
  label,
  disabled = false,
  variant = false,
  action,
}: ActionBtnProps) => {
  return (
    <div
      className={`action-btn-container${disabled ? " disabled" : ""}${variant ? " variant" : ""}`}
    >
      <button className="action-btn" disabled={disabled} onClick={action}>
        {label}
      </button>
      <div className="action-btn__bottom"></div>
      <div className="action-btn__shadow"></div>
    </div>
  );
};

export default ActionBtn;
