import { useEffect, useState } from "react";
import { Calendar } from "./Components";
import { leapMonths, months } from "./Components/Calendar/utils";
import { Todos } from "./Components/Todos/Todos";
import "./App.css";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentDay, setCurrentDay] = useState<number>(date.getDate());
  const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
  const checkIfLeapYear = (year: number) => {
    if (year % 4 === 0 && year % 100 !== 0) {
      return true;
    } else {
      return false;
    }
  };

  let days: number;
  let daysOfMonth: number[] = [];

  if (checkIfLeapYear(date.getFullYear())) {
    days = leapMonths[currentMonth];
  } else {
    days = months[currentMonth];
  }

  useEffect(() => {
    if (checkIfLeapYear(date.getFullYear())) {
      days = leapMonths[currentMonth];
    } else {
      days = months[currentMonth];
    }
  }, [currentMonth]);

  while (days > 0) {
    daysOfMonth.push(days);
    days -= 1;
  }

  daysOfMonth.reverse();

  return (
    <div>
      <Calendar
        setCurrentMonth={setCurrentMonth}
        currentMonth={currentMonth}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        date={date}
        daysOfMonth={daysOfMonth}
      />
      <Todos currentDay={currentDay} daysOfMonth={daysOfMonth} />
    </div>
  );
}

export default App;
