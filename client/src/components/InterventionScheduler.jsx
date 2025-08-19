import { useState, useEffect  } from 'react';
import { useSelector } from "react-redux";
import api from '@/api/axiosInstance';

export default function InterventionScheduler() {
    const [userId, setUserId] = useState('');
    const [date, setDate] = useState('');
    const [services, setServices] = useState([]);
    const [location, setLocation] = useState([]);
    const [message, setMessage] = useState('');
    const {currentUser} = useSelector((state) => state.user);

    // Set the location to the user's address coordinates when currentUser changes
    useEffect(() => {
      if (currentUser && currentUser.address && currentUser.address.coordinates) {
          // Assuming address.coordinates is an array like [longitude, latitude]
          setLocation(currentUser.address.coordinates);
          // setUserId(currentUser._id)
      }
    }, [currentUser]);

    
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      console.log('Submitting appointment with data:', {
        userId: currentUser._id,
        date,
        services,
        location,
      });

      try {
        const response = await api.post('/user/schedule-appointment', {
          userId: currentUser._id,
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
  
    
    return (
      <div className="flex flex-col container mx-auto p-4 w-72">
        <h2 className="text-2xl font-bold mb-4">Schedule an Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            {/* <label htmlFor="userId" className="block text-sm font-medium">
              {currentUser.first_name}
            </label> */}
            {/* <input
              type="text"
              id="userId"
              value={currentUser._id}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
             
              required
            /> */}
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
            {/* <button
              type="button"
              onClick={getUserLocation}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Use Current Location
            </button> */}
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Schedule Appointment
          </button>
        </form>
        {/* {message && <p className="mt-4 text-red-500">{message}</p>} */}
        {message === 'Error scheduling appointment' ? <p className="mt-4 text-red-500">{message}</p> : <p className="mt-4 text-green-500">{message}</p>}
      </div>
    );
}
