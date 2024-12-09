import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Interventions() {
  const [appointments, setAppointments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/user/scheduled-appointments/${currentUser._id}`);
        console.log(response.data.appointments);
        setAppointments(response.data.appointments);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser) {
      fetchAppointments();
    }
  }, [currentUser]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // Make an API call to update the status of the appointment
      const response = await axios.put(`/api/user/scheduled-appointments/update/${appointmentId}`, {
        status: 'Cancelled', // or pass this as part of the request body
      });
  
      if (response.status === 200) {
        // Update the status in the local state
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: 'cancelled' }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      // Optionally, handle errors (e.g., show an error message)
    }
  };
  
  

  return (
    <div>
      <div className='flex flex-col'>
        <div className="flex flex-row w-full justify-center">
          <Link to='/schedule-appointment'>
            <button className='bg-purple-600 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Prendre Rendez-vous</button>
          </Link>
        </div>
        <h2 className='text-3xl text-start font-semibold p-10'>Mes Interventions</h2>
        <div className='flex flex-col gap-10 p-10'>
          {appointments.map((appointment) => (
            <div key={appointment._id} className='flex flex-row gap-10 w-full bg-slate-200 rounded-xl p-5'>
              <img 
                src={appointment.technicianId?.profilePicture || 'default-technician.jpg'} 
                alt={appointment.technicianId?.first_name || 'Technician'} 
                className='object-cover max-w-44 max-h-44 rounded-xl'
              />
              <div className='flex flex-col justify-between w-full'>
                <h3 className='text-2xl'>{appointment.technicianId?.first_name || 'Technician Name'}</h3>
                <p>Date: {new Date(appointment.date).toLocaleString('fr-FR')}</p>
                <p>Status: {appointment.status}</p>
                <p>Détails: {appointment.services.join(', ')}</p>
              </div>
              <div className="flex w-full justify-end">
                <div className="flex flex-col justify-end gap-3">
                  <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Modifier</button>
                  <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Consulter Facture</button>
                  <button onClick={() => handleCancelAppointment(appointment._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Annuler Rendez-Vous</button>
                  {/* {appointment.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="cancel-button bg-red-600 text-white p-2 rounded-md"
                  >
                    Cancel Appointment
                  </button>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
