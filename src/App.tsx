import { useEffect, useState } from "react";
import { Calendar, Todos, Notes } from "./Components";
import { leapMonths, months } from "./Components/Calendar/utils";
import "./App.css";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentDay, setCurrentDay] = useState<number>(date.getDate());
  const [currentMonth, setCurrentMonth] = useState<number>(date.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(date.getFullYear());
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
    if (checkIfLeapYear(currentYear)) {
      days = leapMonths[currentMonth];
    } else {
      days = months[currentMonth];
    }
  }, [currentMonth, currentYear, currentDay]);

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
      <div className="content">
        <Todos
          currentDay={currentDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
        <div className="content-divider"></div>
        <Notes
          currentDay={currentDay}
          daysOfMonth={daysOfMonth}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    </div>
  );
}

export default App;
