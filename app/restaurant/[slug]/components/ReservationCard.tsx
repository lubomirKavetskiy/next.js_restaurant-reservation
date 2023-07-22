'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';

import { partySizes, times } from '@/data';
import useAvailabilities from '@/hooks/useAvailabilities';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';

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
  const { loading, data, error, fetchAvalabilities } = useAvailabilities();

  const handleBtnClick = () => {
    fetchAvalabilities({
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

  const filterTimeByRestaurantOpenWindow = times.filter(
    ({ time }) => time >= openTime && time < closeTime
  );

  return (
    <div className="fixed w-[15%] bg-white rounded p-3 shadow">
      <div className="text-center border-b pb-2 font-bold">
        <h4 className="mr-7 text-lg">Make a Reservation</h4>
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">Party size</label>
        <select
          name=""
          className="py-3 border-b font-light"
          id=""
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
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
            className="py-3 borber-b font-light text-reg w-24"
            dateFormat="MMMM d"
            wrapperClassName="w-[48%]"
          />
        </div>
        <div className="flex flex-col w-[48%]">
          <label htmlFor="">Time</label>
          <select
            name=""
            id=""
            className="py-3 border-b font-light"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {filterTimeByRestaurantOpenWindow.map(({ time, displayTime }) => (
              <option key={time} value={time}>
                {displayTime}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
          onClick={handleBtnClick}
          disabled={loading}
        >
          {loading ? <CircularProgress color="inherit" /> : 'Find a Time'}
        </button>
      </div>
      {data && data.length ? (
        <div className="mt-4">
          <p className="text-reg">Select a Time</p>
          <div className="flex flex-wrap mt-2">
            {data.map(({ available, time }) => {
              return available ? (
                <Link
                  key={time}
                  href={`/reserve/${slug}?date=${day}T${time}&partySize=${partySize}`}
                  className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                >
                  <p className="text-sm font-bold">{time}</p>
                </Link>
              ) : (
                <p
                  key={time}
                  className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3"
                ></p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
