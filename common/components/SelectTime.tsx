import { rangeNumber } from "@/utils/helper.util";
import React, { ChangeEvent, useEffect, useState } from "react";

interface SelectTimeProps {
  size: 2 | 4 | 12;
  setDate: (date: Date) => void;
  date?: Date;
  className?: string
  rangeYear?: number[],
  error?: string
}

const SelectTime: React.FC<SelectTimeProps> = ({ size, setDate, date, className, rangeYear, error }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [lastDayInMonth, setLastDayInMonth] = useState(new Date(year, month, 0).getDate());

  const handleChangeMonth = (event: ChangeEvent<HTMLSelectElement>) => {
    const monthValue = Number(event.currentTarget.value);
    setMonth(monthValue);
  };

  const handleChangeYear = (event: ChangeEvent<HTMLSelectElement>) => {
    const yearValue = Number(event.currentTarget.value);
    setYear(yearValue);
  };

  const handleChangeDay = (event: ChangeEvent<HTMLSelectElement>) => {
    const dayValue = Number(event.currentTarget.value);
    setDay(dayValue);
  };

  useEffect(() => {
    if (date) {
      setDay(date.getDate());
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
  }, [date]);

  useEffect(() => {
    setLastDayInMonth(new Date(year, month, 0).getDate());
  }, [month, year]);

  useEffect(() => {
    setDate(new Date(`${year}-${month}-${day}`));
  }, [day, month, year]);

  return (
    <div className={`row ${className ?? ''}`}>
      <div className={`col-lg-${size} col-4`}>
        <select className="form-control" onChange={handleChangeDay} value={day}>
          {rangeNumber(1, lastDayInMonth + 1).map((dayValue) => (
            <option key={dayValue} value={dayValue}>
              {dayValue < 10 ? "0" + dayValue : dayValue}
            </option>
          ))}
        </select>
      </div>
      <div className={`col-lg-${size} col-4`}>
        <select className="form-control" onChange={handleChangeMonth} value={month}>
          {rangeNumber(1, 13).map((monthValue) => (
            <option key={monthValue} value={monthValue}>
              T{monthValue < 10 ? "0" + monthValue : monthValue}
            </option>
          ))}
        </select>
      </div>
      <div className={`col-lg-${size} col-4`}>
        <select className="form-control" onChange={handleChangeYear} value={year}>
          {
            (rangeYear && rangeYear.length >= 2) ? 
            rangeNumber(rangeYear[0], rangeYear[1]).map((yearValue) => (
              <option key={yearValue} value={yearValue}>
                {yearValue}
              </option>
            )) : 
            rangeNumber(currentYear, currentYear + 3).map((yearValue) => (
              <option key={yearValue} value={yearValue}>
                {yearValue}
              </option>
            ))
          }
        </select>
      </div>
      {
        error && 
        <div className="col-12">
          <div className="error invalid-feedback" style={{display: 'block'}}>{error}</div>
        </div>
      }
    </div>
  );
};

export default SelectTime;