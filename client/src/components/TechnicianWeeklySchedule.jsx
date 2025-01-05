import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TechnicianWeeklySchedule = ({ technicianId, onTimeSlotSelect }) => {
  const [weekStart, setWeekStart] = useState(new Date());
  const [availability, setAvailability] = useState([]);

  const fetchAvailability = async () => {
    try {
      const start = weekStart.toISOString().split('T')[0];
      const response = await axios.get(`/api/technicians/${technicianId}/availability`, {
        params: { weekStart: start },
      });
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    setWeekStart(prev);
  };

  useEffect(() => {
    fetchAvailability();
  }, [weekStart]);

  return (
    <div className="weekly-schedule">
      <div className="flex justify-between items-center mb-4">
        <button className="btn" onClick={prevWeek}>Previous Week</button>
        <h2 className="text-xl font-bold">
          Week of {weekStart.toLocaleDateString()}
        </h2>
        <button className="btn" onClick={nextWeek}>Next Week</button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {availability.map((day) => (
          <div key={day.date} className="border p-4 rounded">
            <h3 className="font-bold">{new Date(day.date).toLocaleDateString()}</h3>
            <ul>
              {day.timeSlots.map((slot, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer ${slot.isBooked ? 'bg-gray-300' : 'bg-green-300'}`}
                  onClick={() => !slot.isBooked && onTimeSlotSelect(day.date, slot.time)}
                >
                  {slot.time}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianWeeklySchedule;
