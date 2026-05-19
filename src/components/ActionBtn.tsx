import "./ActionBtn.css"

type ActionBtnProps = {
    label: string,
    disable?: boolean,
    action: () => void
};

const ActionBtn = ({ label, disable = false, action }: ActionBtnProps) => {
  return (
    <div className={`container${disable ? " disabled" : ""}`}>
        <button className="action-btn" disabled={disable} onClick={action}>
            {label} 🖱✨
        </button>
        <div className="action-btn__bottom"></div>
        <div className="action-btn__shadow"></div>
    </div>
  )
}

export default ActionBtn;