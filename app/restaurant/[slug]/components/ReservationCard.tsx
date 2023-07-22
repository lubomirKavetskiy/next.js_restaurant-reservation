'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { partySizes, times } from '@/data';
import useAvailability from '@/hooks/useAvailability';

interface IProps {
  openTime: string;
  closeTime: string;
  slug: string;
}

export default function ReservationCard({ openTime, closeTime, slug }: IProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(openTime);
  const [partySize, setPartySize] = useState('2');
  const { loading, data, error, fetchAvalability } = useAvailability();

  const handleBtnClick = () => {
    fetchAvalability({
      slug,
      day,
      time,
      partySize,
    });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = date.toISOString().split('T')[0];
      setDay(day);
      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const filteredTimeByRestaurantOpenWindow = times.filter(
    ({ time }) => time >= openTime && time < closeTime
  );

  console.log({ loading, data, error });

  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[15%] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            name=""
            className="py-3 border-b font-light"
            id=""
          >
            {partySizes.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="py-3 border-b font-light w-24 text-reg"
              dateFormat="MMMM d"
              wrapperClassName="w-[48%]"
            />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              name=""
              id=""
              className="py-3 border-b font-light"
            >
              {filteredTimeByRestaurantOpenWindow.map(
                ({ time, displayTime }) => (
                  <option key={time} value={time}>
                    {displayTime}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            onClick={handleBtnClick}
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          >
            Find a Time
          </button>
        </div>
      </div>
    </div>
  );
}
