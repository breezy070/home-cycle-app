import { useState } from 'react';
import axios from 'axios';

export default function InterventionScheduler() {
    const [userId, setUserId] = useState('');
    const [date, setDate] = useState('');
    const [services, setServices] = useState([]);
    const [location, setLocation] = useState([]);
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post('/api/appointments/schedule-appointment', {
          userId,
          date,
          services,
          location,
        });
  
        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        setMessage('Error scheduling appointment');
      }
    };
  
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation([position.coords.longitude, position.coords.latitude]);
          },
          (error) => {
            console.error(error);
            setMessage('Unable to get location');
          }
        );
      } else {
        setMessage('Geolocation is not supported by your browser');
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Schedule an Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium">
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium">
              Appointment Date
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="services" className="block text-sm font-medium">
              Services
            </label>
            <input
              type="text"
              id="services"
              value={services}
              onChange={(e) => setServices(e.target.value.split(','))}
              placeholder="Service1,Service2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <button
              type="button"
              onClick={getUserLocation}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Use Current Location
            </button>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Schedule Appointment
          </button>
        </form>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    );
}
