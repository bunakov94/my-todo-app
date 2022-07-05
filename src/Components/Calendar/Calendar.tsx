import { useEffect, useState } from "react";
import "./Calendar.css";
import { leapMonths, months } from "./utils";

interface CalendarProps {
  setCurrentDay: (currentDay: number) => void;
  currentDay: number;
  date: Date;
  daysOfMonth: number[];
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (currentMonth: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDay,
  setCurrentDay,
  date,
  daysOfMonth,
  setCurrentMonth,
  currentMonth,
  currentYear,
}) => {
  const [weeks, setWeeks] = useState([
    { Mon: "", Tue: "", Wed: "", Thu: "", Fri: "", Sat: "", Sun: "" },
  ]);

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

  const getMonth = (month: number) => {
    if (month === 0) {
      return "January";
    } else if (month === 1) {
      return "February";
    } else if (month === 2) {
      return "March";
    } else if (month === 3) {
      return "April";
    } else if (month === 4) {
      return "May";
    } else if (month === 5) {
      return "June";
    } else if (month === 6) {
      return "July";
    } else if (month === 7) {
      return "August";
    } else if (month === 8) {
      return "September";
    } else if (month === 9) {
      return "October";
    } else if (month === 10) {
      return "November";
    } else if (month === 11) {
      return "December";
    }
  };
  const checkIfLeapYear = (year: number) => {
    if (year % 4 === 0 && year % 100 !== 0) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (checkIfLeapYear(currentYear)) {
      if (leapMonths[currentMonth] < currentDay) {
        setCurrentDay(leapMonths[currentMonth]);
      }
    } else {
      if (months[currentMonth] < currentDay) {
        setCurrentDay(months[currentMonth]);
      }
    }
  }, [currentMonth]);

  return (
    <div>
      <h3 className="month-name">{getMonth(currentMonth)}</h3>
      <hr />
      <ul className="current-month">
        <li
          className="arrow"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          <span>{"<"}</span>
        </li>
        {daysOfMonth.map((day) => (
          <>
            <li
              className={day === currentDay ? "active day" : "day"}
              key={day}
              onClick={() => {
                setCurrentDay(day);
              }}
            >
              {day}
              <div>
                {getDayOfWeek(
                  new Date(
                    date.getTime() -
                      (date.getDate() - day) * 24 * 1000 * 60 * 60
                  ).getDay()
                )}
              </div>
            </li>
            {getDayOfWeek(
              new Date(
                date.getTime() - (date.getDate() - day) * 24 * 1000 * 60 * 60
              ).getDay()
            ) === "Sun" && <span key={Date.now()} className="divider" />}
          </>
        ))}
        <li
          className="arrow"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          <span>{">"}</span>
        </li>
      </ul>
      <hr />
    </div>
  );
};
