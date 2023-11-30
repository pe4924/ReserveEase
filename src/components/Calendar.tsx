import { useState, FC } from "react";
import LogoutButton from "./LogOut";
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

const events = [
  {
    title: "平田A",
    start: "2023-11-01T10:00",
    end: "2023-11-01T11:45",
    extendedProps: {
      description: "平田俊一",
    },
  },
  {
    title: "平田C",
    start: "2023-11-01T12:00",
    end: "2023-11-01T14:00",
    extendedProps: {
      description: "平田俊二",
    },
  },
  {
    title: "平田D",
    start: "2023-11-01T17:00",
    end: "2023-11-01T21:15",
    extendedProps: {
      description: "平田俊三",
    },
  },
  {
    title: "平田A",
    start: "2023-11-08T10:00",
    end: "2023-11-08T11:45",
    extendedProps: {
      description: "平田俊一",
    },
  },
  {
    title: "平田C",
    start: "2023-11-08T12:00",
    end: "2023-11-08T14:00",
    extendedProps: {
      description: "平田俊二",
    },
  },
  {
    title: "平田D",
    start: "2023-11-08T17:00",
    end: "2023-11-08T21:15",
    extendedProps: {
      description: "平田俊三",
    },
  },
  {
    title: "平田A",
    start: "2023-11-15T10:00",
    end: "2023-11-15T11:45",
    extendedProps: {
      description: "平田俊一",
    },
  },
  {
    title: "平田C",
    start: "2023-11-15T12:00",
    end: "2023-11-15T14:00",
    extendedProps: {
      description: "平田俊二",
    },
  },
  {
    title: "平田D",
    start: "2023-11-15T17:00",
    end: "2023-11-15T21:15",
    extendedProps: {
      description: "平田俊三",
    },
  },
  {
    title: "平田A",
    start: "2023-11-22T10:00",
    end: "2023-11-22T11:45",
    extendedProps: {
      description: "平田俊一",
    },
  },
  {
    title: "平田C",
    start: "2023-11-22T12:00",
    end: "2023-11-22T14:00",
    extendedProps: {
      description: "平田俊二",
    },
  },
  {
    title: "平田D",
    start: "2023-11-22T17:00",
    end: "2023-11-22T21:15",
    extendedProps: {
      description: "平田俊三",
    },
  },
  {
    title: "平田A",
    start: "2023-11-29T10:00",
    end: "2023-11-29T11:45",
    extendedProps: {
      description: "平田俊一",
    },
  },
  {
    title: "平田C",
    start: "2023-11-29T12:00",
    end: "2023-11-29T14:00",
    extendedProps: {
      description: "平田俊二",
    },
  },
  {
    title: "平田D",
    start: "2023-11-29T17:00",
    end: "2023-11-29T21:15",
    extendedProps: {
      description: "平田俊三",
    },
  },
  {
    title: "平田B",
    start: "2023-11-30T15:00:00",
    end: "2023-11-30T17:30:00",
    extendedProps: {
      description: "平田ははは",
    },
  },
];

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const handleEventClick = (arg: EventClickArg): void => {
    setSelectedEvent({
      title: arg.event.title,
      start: arg.event.start,
      end: arg.event.end,
      description: arg.event.extendedProps.description || "",
    });
    setIsModalOpen(true);
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
                  <p>タイトル: {selectedEvent?.title}</p>
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
                    氏名: {selectedEvent?.description}
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
    </>
  );
};

export default Calendar;
