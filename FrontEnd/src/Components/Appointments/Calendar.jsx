import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
    return (
        <div style={{ height: "95vh", marginTop: "20px", padding: "10px" }}>
            <BigCalendar {...props} localizer={localizer} />
        </div>
    );
}