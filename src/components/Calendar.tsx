import { useState, useEffect, FC } from "react";
import LogoutButton from "./LogOut";
import Reservation from "./Reservation";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
} from "@chakra-ui/react";

type EventDetails = {
  title: string;
  start: Date | null;
  end: Date | null;
  description: string | null;
};

type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    description: string;
  };
};

type EventApiResponse = {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  user_id: string;
  last_name: string;
};

const formatToJapaneseDateTime = (date: Date | null): string => {
  if (!date) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  };

  return new Intl.DateTimeFormat("ja-JP", options).format(date);
};

function calculateDuration(
  start: Date | null | undefined,
  end: Date | null | undefined
): string {
  if (!start || !end) {
    return "";
  }

  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.round((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}時間${minutes}分`;
}

const Calendar: FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/");
        const data: EventApiResponse[] = await response.json();
        const transformedData = data.map((event) => ({
          title: event.title,
          start: event.start_date,
          end: event.end_date,
          extendedProps: {
            description: `${event.last_name} ${event.description}`,
          },
        }));
        setEvents(transformedData);
      } catch (error) {
        console.error("イベントデータの取得に失敗しました", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (arg: EventClickArg): void => {
    setSelectedEvent({
      title: arg.event.title,
      start: arg.event.start,
      end: arg.event.end,
      description: arg.event.extendedProps.description || "",
    });
    setIsModalOpen(true);
    setIsDateModalOpen(false);
  };

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    setSelectedDate(arg.date);
    setIsDateModalOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <Flex justifyContent="flex-end">
        <LogoutButton />
      </Flex>
      <div className="calendar">
        <div className="calendar-main">
          <FullCalendar
            locale={jaLocale}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            nowIndicator={true}
            events={events}
            allDaySlot={false}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            slotDuration={"00:15:00"}
            slotLabelInterval={"01:00:00"}
            slotMinTime="08:00:00"
            slotMaxTime="24:00:00"
            contentHeight="auto"
            stickyHeaderDates={true}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
        {isModalOpen && (
          <Center>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>予約詳細</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <p>{selectedEvent?.title}</p>
                  {selectedEvent?.start && (
                    <p>
                      開始時間: {formatToJapaneseDateTime(selectedEvent.start)}
                    </p>
                  )}
                  {selectedEvent?.end && (
                    <p>
                      終了時間: {formatToJapaneseDateTime(selectedEvent.end)}
                    </p>
                  )}
                  <p>
                    氏名: {selectedEvent?.description}様
                    <br />
                    利用時間:{" "}
                    {calculateDuration(
                      selectedEvent?.start,
                      selectedEvent?.end
                    )}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    style={{
                      background: "linear-gradient(45deg, blue, purple)",
                      color: "white",
                    }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    閉じる
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Center>
        )}
      </div>
      <Reservation
        date={selectedDate}
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />
    </>
  );
};

export default Calendar;
