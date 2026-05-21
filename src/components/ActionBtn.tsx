import "./ActionBtn.css"

type ActionBtnProps = {
    label: string,
    disable?: boolean,
    variant?: boolean,
    action: () => void
};

const ActionBtn = ({ label, disable = false, variant = false, action }: ActionBtnProps) => {
  return (
    <div className={`action-btn-container${disable ? " disabled" : ""}${variant ? " variant" : ""}`}>
        <button className="action-btn" disabled={disable} onClick={action}>
            {label}
        </button>
        <div className="action-btn__bottom"></div>
        <div className="action-btn__shadow"></div>
    </div>
  )
}

export default ActionBtn;