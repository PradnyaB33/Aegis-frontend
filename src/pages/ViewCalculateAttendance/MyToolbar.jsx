import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const MyToolbar = ({ label, onNavigate }) => {
  const currentDate = moment().format("MMMM YYYY");
  const isCurrentMonth = label === currentDate;

  return (
    <div className="rbc-toolbar">
      <span className="rbc-toolbar-label">
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          style={{ marginRight: "10px" }}
        >
          &lt;
        </button>
        {isCurrentMonth ? <strong>{label}</strong> : label}
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          style={{ marginLeft: "10px" }}
        >
          &gt;
        </button>
      </span>
    </div>
  );
};

export default MyToolbar;
