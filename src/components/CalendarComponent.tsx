import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ja } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "../day-picker.css";

const CalendarComponent = () => {
  const [selected, setSelected] = useState<Date>();

  return (
    <div>
      <DayPicker
        locale={ja}
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
    </div>
  );
};

export default CalendarComponent;
