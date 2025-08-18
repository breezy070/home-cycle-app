import React, { useState, useEffect } from 'react';
import TechnicianWeeklySchedule from './TechnicianWeeklySchedule';
import { useSelector } from "react-redux";
import axios from '@/api/axiosInstance';

const ScheduleAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [technicianId] = useState('6756c96412c651085aa1cbe8'); // Replace with selected technician ID
  const [technicians, setTechnicians] = useState([]);
  const {currentUser} = useSelector((state) => state.user);

    // Fetch all technicians
    useEffect(() => {
        const fetchTechnicians = async () => {
          try {
            const response = await axios.get('/api/admin/technicians');
            setTechnicians(response.data.technicians);
          } catch (error) {
            console.error('Error fetching technicians:', error);
          }
        };
    
        fetchTechnicians();
      }, []);

  const handleTimeSlotSelect = (date, time) => {
    setSelectedSlot({ date, time });
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) return alert('Please select a time slot.');

    try {
      const response = await axios.post('/api/appointments/book', {
        technicianId,
        date: selectedSlot.date,
        time: selectedSlot.time,
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="schedule-appointment">
      <TechnicianWeeklySchedule technicianId={technicianId} onTimeSlotSelect={handleTimeSlotSelect} />
      <button
        onClick={handleBookAppointment}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Confirm Appointment
      </button>
    </div>
  );
};

export default ScheduleAppointment;
