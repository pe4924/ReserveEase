import { FC, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  FormControl,
  FormLabel,
  Select,
  Flex,
  Spinner,
} from "@chakra-ui/react";

type ReservationModalProps = {
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear + i);
};

const getMonthOptions = () => Array.from({ length: 12 }, (_, i) => i + 1);

const getDayOptions = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const getMinuteOptions = () => [0, 15, 30, 45];

const getStartHourOptions = () => Array.from({ length: 15 }, (_, i) => 8 + i);
const getEndHourOptions = () => Array.from({ length: 17 }, (_, i) => 8 + i);

const Reservation: FC<ReservationModalProps> = ({ date, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReservationComplete, setIsReservationComplete] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    date ? date.getMonth() + 1 : new Date().getMonth() + 1
  );
  const [selectedDay, setSelectedDay] = useState<number>(
    date ? date.getDate() : new Date().getDate()
  );
  const [startHour, setStartHour] = useState<number>(
    date ? date.getHours() : new Date().getHours()
  );
  const [startMinute, setStartMinute] = useState<number>(
    date
      ? (Math.ceil(date.getMinutes() / 15) * 15) % 60
      : (Math.ceil(new Date().getMinutes() / 15) * 15) % 60
  );
  const [endHour, setEndHour] = useState<number>(
    date ? date.getHours() : new Date().getHours()
  );
  const [endMinute, setEndMinute] = useState<number>(
    date
      ? (Math.ceil(date.getMinutes() / 15) * 15) % 60
      : (Math.ceil(new Date().getMinutes() / 15) * 15) % 60
  );

  const handleReservation = async () => {
    setIsLoading(true);
    try {
      const startDate = new Date(
        selectedYear,
        selectedMonth - 1,
        selectedDay,
        startHour,
        startMinute
      ).toISOString();
      const endDate = new Date(
        selectedYear,
        selectedMonth - 1,
        selectedDay,
        endHour,
        endMinute
      ).toISOString();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("ユーザーがログインしていません。");

      const response = await fetch("http://localhost:8000/add-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          start_date: startDate,
          end_date: endDate,
          title: "予約あり",
          description: "",
        }),
      });

      if (!response.ok) {
        throw new Error("予約に失敗しました。");
      }
      setTimeout(() => {
        setIsLoading(false);
        setIsReservationComplete(true);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("予約エラー:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth() + 1);
      setSelectedDay(date.getDate());

      const isMonthView = date.getHours() === 0 && date.getMinutes() === 0;
      const startHour = isMonthView ? 10 : Math.min(date.getHours(), 22);
      setStartHour(startHour);
      setStartMinute(
        isMonthView ? 0 : (Math.ceil(date.getMinutes() / 15) * 15) % 60
      );

      let endHourCalculation;
      if (startHour === 22) {
        endHourCalculation = 24;
      } else {
        endHourCalculation = startHour + 2;
      }
      setEndHour(endHourCalculation > 24 ? 24 : endHourCalculation);
      setEndMinute(
        isMonthView ? 0 : (Math.ceil(date.getMinutes() / 15) * 15) % 60
      );
    }
  }, [date]);

  return (
    <Center>
      {isReservationComplete && (
        <Modal
          isOpen={isReservationComplete}
          onClose={() => {
            setIsReservationComplete(false);
            onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>予約完了</ModalHeader>
            <ModalCloseButton />
            <ModalBody>予約が完了しました。</ModalBody>
            <ModalFooter>
              <Button
                borderRadius={5}
                type="submit"
                width="full"
                style={{
                  background: "linear-gradient(45deg, blue, purple)",
                  color: "white",
                }}
                onClick={() => setIsReservationComplete(false)}
              >
                閉じる
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>予約確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <FormControl>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {getMonthOptions().map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                >
                  {getDayOptions(selectedYear, selectedMonth).map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <Flex mt={4} align="end">
              <FormControl mr={4}>
                <FormLabel htmlFor="start-hour">開始時刻</FormLabel>
                <Select
                  id="start-hour"
                  value={startHour}
                  onChange={(e) => setStartHour(Number(e.target.value))}
                >
                  {getStartHourOptions().map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}時
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  id="start-minute"
                  value={startMinute}
                  onChange={(e) => setStartMinute(Number(e.target.value))}
                >
                  {getMinuteOptions().map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}分
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            <Flex mt={4} align="end">
              <FormControl mr={4}>
                <FormLabel htmlFor="end-hour">終了時刻</FormLabel>
                <Select
                  id="end-hour"
                  value={endHour}
                  onChange={(e) => setEndHour(Number(e.target.value))}
                >
                  {getEndHourOptions().map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}時
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <Select
                  id="end-minute"
                  value={endMinute}
                  onChange={(e) => setEndMinute(Number(e.target.value))}
                >
                  {getMinuteOptions().map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}分
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleReservation}
              disabled={isLoading}
              borderRadius={5}
              type="submit"
              width="full"
              style={{
                background: "linear-gradient(45deg, blue, purple)",
                color: "white",
              }}
            >
              {isLoading ? <Spinner size="sm" /> : "予約する"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default Reservation;
