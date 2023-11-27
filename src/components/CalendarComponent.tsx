import { useState, useEffect } from "react";

type Schedule = {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
};

const CalendarComponent = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const dummyData: Schedule[] = [
      {
        id: 0,
        name: "Aさん",
        date: "2023-11-27",
        startTime: "10:00",
        endTime: "17:00",
      },
      {
        id: 1,
        name: "Bさん",
        date: "2023-11-27",
        startTime: "12:00",
        endTime: "14:00",
      },
      // その他のデータ...
    ];
    setSchedules(dummyData);
  }, []);

  const isScheduledTime = (schedule: Schedule, hour: string): boolean => {
    const scheduleStart = new Date(`${schedule.date}T${schedule.startTime}`);
    const scheduleEnd = new Date(`${schedule.date}T${schedule.endTime}`);
    const currentHour = new Date(`${schedule.date}T${hour}`);

    // 予定の開始時刻と終了時刻を30分間隔に合わせる
    scheduleStart.setMinutes(
      scheduleStart.getMinutes() - (scheduleStart.getMinutes() % 30)
    );
    scheduleEnd.setMinutes(
      scheduleEnd.getMinutes() + ((30 - (scheduleEnd.getMinutes() % 30)) % 30)
    );

    return currentHour >= scheduleStart && currentHour < scheduleEnd;
  };

  const renderCalendar = () => {
    const hours: string[] = [];
    for (let hour = 9; hour <= 22; hour++) {
      hours.push(`${hour}:00`);
    }

    const filteredSchedules = schedules.filter(
      (schedule) => schedule.date === selectedDate
    );

    return (
      <div className="calendar-container">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <table className="calendar-table">
          <thead>
            <tr>
              <th></th>
              {hours.map((hour) => (
                <th key={hour} className="hour">
                  {hour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.name}</td>
                {hours.map((hour, index) => (
                  <td
                    key={hour}
                    className={
                      isScheduledTime(schedule, hour) ? "scheduled-time" : ""
                    }
                  >
                    {index % 4 === 0 ? (
                      ""
                    ) : (
                      <div className="quarter-hour"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return renderCalendar();
};

export default CalendarComponent;
