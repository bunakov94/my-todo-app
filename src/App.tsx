import { useState } from "react";
import "./App.css";
import { Calendar } from "./Components";

function App() {
  const [date, setDate] = useState<Date>(new Date());
  const [currentDay, setCurrentDay] = useState<number>(date.getDate());

  return (
    <div>
      <Calendar
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        date={date}
      />
      
    </div>
  );
}

export default App;
