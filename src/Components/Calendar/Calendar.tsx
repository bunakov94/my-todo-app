import { useState } from "react";
import { months } from "./utils";
import "./Calendar.css";

interface CalendarProps {
  setCurrentDay: (currentDay: number) => void;
  currentDay: number;
  date: Date
}

export const Calendar: React.FC<CalendarProps> = ({currentDay, setCurrentDay, date}) => { 
  let daysOfMonth: number[] = [];
  let days = months[date.getMonth()];

  const getDayOfWeek = (day: number) => {
    if (day === 1) {
      return "Mon";
    } else if (day === 2) {
      return "Tue";
    } else if (day === 3) {
      return "Wed";
    } else if (day === 4) {
      return "Thu";
    } else if (day === 5) {
      return "Fri";
    } else if (day === 6) {
      return "Sat";
    } else {
      return "Sun";
    }
  };
  while (days > 0) {
    daysOfMonth.push(days);
    days -= 1;
    console.log(days);
  }

  daysOfMonth.reverse();

  return (
    <div>
      <ul className="current-month">
        {daysOfMonth.map((day) => (
          <li
            className={day === currentDay ? "active day" : "day"}
            key={day}
            onClick={() => setCurrentDay(day)}
          >
            {day}
            <div>
              {getDayOfWeek(
                new Date(
                  date.getTime() - (date.getDate() - day) * 24 * 1000 * 60 * 60
                ).getDay()
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
