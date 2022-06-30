import { useState } from "react";
import { Calendar } from "./Components";
import { months } from "./Components/Calendar/utils";
import { Todos } from "./Components/Todos/Todos";
import "./App.css";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentDay, setCurrentDay] = useState<number>(date.getDate());
  let days = months[date.getMonth()];
  let daysOfMonth: number[] = [];

  while (days > 0) {
    daysOfMonth.push(days);
    days -= 1;
  }

  daysOfMonth.reverse();

  return (
    <div>
      <Calendar
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
