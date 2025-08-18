import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Interventions() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]); // To store filtered appointments
  const [filterServices, setFilterServices] = useState('All'); // Track the selected filter

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    console.log(currentUser)
    const fetchAppointments = async () => {
      if (currentUser.role === 'user') {
        console.log("displaying user appointments")
        try {
          const response = await axios.get(`/api/user/scheduled-appointments/${currentUser._id}`);
          console.log(response.data);
          setAppointments(response.data.appointments);
          setFilteredAppointments(response.data.appointments);
        } catch (err) {
          console.error(err);
        }
      } else if (currentUser.role === 'technician') {
        console.log("displaying technician appointments")
        try {
          const response = await axios.get(`/api/technician/scheduled-technician-appointments/${currentUser._id}`);
          console.log(response.data);
          setAppointments(response.data.appointments);
          setFilteredAppointments(response.data.appointments);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log("displaying admin")
      }
    };

    if (currentUser) {
      fetchAppointments();
    }
  }, [currentUser]);

  useEffect(() => {
    // Filter appointments based on the selected type
    if (filterServices === 'All') {
      setFilteredAppointments(appointments); // Show all appointments
    } else {
      setFilteredAppointments(
        appointments.filter((appointment) => appointment.services[0] === filterServices)
      );
    }
  }, [filterServices, appointments]);

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
            //important to use the mongo ._id
            appointment._id === appointmentId
              ? { ...appointment, status: 'Cancelled' }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      // Optionally, handle errors (e.g., show an error message)
    }
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      // Make an API call to update the status of the appointment
      const response = await axios.put(`/api/user/scheduled-appointments/update/${appointmentId}`, {
        status: 'Accepted',
      });
  
      if (response.status === 200) {
        // Update the status in the local state
        setAppointments((prev) =>
          prev.map((appointment) =>
            //important to use the mongo ._id
            appointment._id === appointmentId
              ? { ...appointment, status: 'Accepted' }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Failed to accept appointment:', error);
      // Optionally, handle errors (e.g., show an error message)
    }
  };

  const handleRefuseAppointment = async (appointmentId) => {
    try {
      // Make an API call to update the status of the appointment
      const response = await axios.put(`/api/user/scheduled-appointments/update/${appointmentId}`, {
        status: 'Refused', // or pass this as part of the request body
      });
  
      if (response.status === 200) {
        // Update the status in the local state
        setAppointments((prev) =>
          prev.map((appointment) =>
            //important to use the mongo ._id
            appointment._id === appointmentId
              ? { ...appointment, status: 'Refused' }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Failed to refuse appointment:', error);
      // Optionally, handle errors (e.g., show an error message)
    }
  };
  
  useEffect(() => {
    console.log('Updated Appointments:', appointments);
  }, [appointments]);

  const handleFilterChange = (e) => {
    setFilterServices(e.target.value);
  };

  const fetchComments = async (appointmentId) => {
    try {
      const response = await axios.get(`/api/interventions/intervention-comments/${appointmentId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const addComment = async (appointmentId) => {
    try {

      const userModel = currentUser.role === 'user' ? 'User' : 'Technician';

      const response = await axios.post(`/api/interventions/intervention-comments/${appointmentId}/comments`, {
        userId: currentUser._id,
        text: newComment,
        userModel: userModel,    // Specify the model (User or Technician)
      });
      console.log(response.data)
      setComments(response.data); // Update comments with the latest data
      setNewComment(''); // Clear the input field
      fetchComments(appointmentId);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const toggleComments = (appointmentId) => {
    if (selectedAppointment === appointmentId) {
      // If the selected appointment is already open, close it
      setSelectedAppointment(null);
    } else {
      // Open the comments for the selected appointment
      setSelectedAppointment(appointmentId);
      fetchComments(appointmentId); // Fetch comments for this appointment
    }
  };

  return (
    <div>
      <div className='flex flex-col'>
        {currentUser.role === "user" ? 
          <div className="flex flex-row w-full justify-center">
            <Link to='/schedule-appointment'>
              <button className='bg-purple-600 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Prendre Rendez-vous</button>
            </Link>
          </div>
        : ""}

        {/* Filter Input */}
        <div className="flex justify-center p-5">
          <label htmlFor="filter" className="mr-3 text-lg font-semibold">Filter by Service:</label>
            <select
              id="filter"
              className="p-2 border border-gray-300 rounded-lg"
              value={filterServices}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="reparation">Reparation</option>
              <option value="entretien">Entretien</option>
            </select>
        </div>

        <h2 className='text-3xl text-start font-semibold p-10'>Mes Interventions</h2>
          {/* Conditional Rendering for No Appointments */}
          {!appointments.length ? (
            <div className="flex justify-center items-center text-center p-10">
              <p className="text-xl text-red-500">
                Aucune intervention programmée trouvée.
                {/* https://www.shutterstock.com/shutterstock/photos/1874828509/display_1500/stock-photo-profile-of-a-young-brown-tabby-cat-on-a-warm-gray-background-1874828509.jpg */}
              </p>
            </div>
            ) : (
            <div className='flex flex-col gap-10 p-10'>
              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className={`flex flex-row gap-10 w-full ${appointment.status === 'Pending' ? 'bg-orange-200' : appointment.status === 'Accepted' ? 'bg-green-200' : ''} ${appointment.status === 'Cancelled' || appointment.status === 'Refused' ? `bg-red-200 opacity-50` : ``} rounded-xl p-5`}>
                  {/* PROFILE IMAGES */}
                  {currentUser.role === 'technician'
                  ? 
                  <img 
                    src={appointment.userId?.profilePicture || 'default-technician.jpg'} 
                    alt={appointment.userId?.first_name || 'Technician'} 
                    className='object-cover max-w-44 max-h-44 rounded-xl'
                  />
                  :
                  ''
                  }

                  {currentUser.role === 'user'
                  ? <img 
                    src={appointment.technicianId?.profilePicture || 'default-user.jpg'} 
                    alt={appointment.technicianId?.first_name || 'User'} 
                    className='object-cover max-w-44 max-h-44 rounded-xl'
                    />
                  :
                  ''
                  }

                  {/* APPOINTMENT INFORMATION */}

                  {currentUser.role === 'technician'
                  ? 
                  <div className= 'flex flex-col justify-between w-fit'> 
                    <h3 className='text-2xl'>Client {appointment.userId?.first_name || 'Technician Name'}</h3>
                    <p>Date: {new Date(appointment.date).toLocaleString('fr-FR')}</p>

                    {appointment.status === 'Cancelled' || appointment.status === 'Refused'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md	 text-red-600`}>Status: {appointment.status}</p>
                    :''
                    }
                    {appointment.status === 'Pending' || appointment.status === 'In Progress'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md text-yellow-600`}>Status: {appointment.status}</p>
                    : ''
                    }
                    {appointment.status === 'Accepted'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md	 text-green-600`}>Status: {appointment.status}</p>
                    : ''
                    }
                    <p>Détails: {appointment.services.join(', ')}</p>

                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:opacity-90"
                      onClick={() => toggleComments(appointment._id)}
                    >
                      {selectedAppointment === appointment._id ? "Hide Comments" : "Comments"}
                    </button>

                    {selectedAppointment === appointment._id && (
                      <div className='mt-5 break-words max-w-sm'>
                        <h4 className='text-xl font-semibold mb-2'>Comments</h4>
                        <ul className='list-disc'>
                          {comments.map((comment) => (
                            <li key={comment._id} className='mb-2 list-none'>
                              <p><span className={`underline font-bold ${comment.userModel === 'User' ? 'text-blue-800' : 'text-red-800'}`}>{comment.user?.first_name}:</span> {comment.text}<span className='text-gray-500'><br></br><span className='text-xs'>{new Date(comment.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}</span></span></p>
                            </li>
                          ))}
                        </ul>
                        <div className='flex flex-col'>
                          <textarea
                            className='border p-2 w-full mt-3 rounded-md'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write a comment...'
                          />
                          <button
                            className='bg-green-500 text-white p-2 mt-2 rounded-md hover:opacity-90'
                            onClick={() => addComment(appointment._id)}
                          >
                            Add Comment
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                  :
                  ''
                  }
                  
                  {currentUser.role === 'user'
                  ? 
                  <div className= 'flex flex-col justify-between w-fit'> 
                    <h3 className='text-2xl'>Technician {appointment.technicianId?.first_name || 'Technician Name'}</h3>
                    <p>Date: {new Date(appointment.date).toLocaleString('fr-FR')}</p>
                    {appointment.status === 'Cancelled' || appointment.status === 'Refused'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md	 text-red-600`}>Status: {appointment.status}</p>
                    :''
                    }
                    {appointment.status === 'Pending' || appointment.status === 'In Progress'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md	 text-yellow-600`}>Status: {appointment.status}</p>
                    : ''
                    }
                    {appointment.status === 'Accepted'
                    ? <p className={`w-fit p-1 font-bold  uppercase shadow-md	 text-green-600`}>Status: {appointment.status}</p>
                    : ''
                    }
                    <p>Détails: {appointment.services.join(', ')}</p>
                    
                    <button
                      className="bg-blue-500 text-white p-2 rounded-md hover:opacity-90"
                      onClick={() => toggleComments(appointment._id)}
                    >
                      {selectedAppointment === appointment._id ? "Hide Comments" : "Comments"}
                    </button>

                    {selectedAppointment === appointment._id && (
                      <div className='mt-5 break-words max-w-sm'>
                        <h4 className='text-xl font-semibold mb-2'>Comments</h4>
                        <ul className='list-disc'>
                          {comments.map((comment) => (
                            <li key={comment._id} className='mb-2 list-none'>
                              <p><span className={`underline font-bold ${comment.userModel === 'User' ? 'text-blue-800' : 'text-red-800'}`}>{comment.user?.first_name}:</span> {comment.text}<span className='text-gray-500'><br></br><span className='text-xs'>{new Date(comment.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}</span></span></p>
                            </li>
                          ))}
                        </ul>
                        <div className='flex flex-col'>
                          <textarea
                            className='border p-2 w-full mt-3 rounded-md'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write a comment...'
                          />
                          <button
                            className='bg-green-500 text-white p-2 mt-2 rounded-md hover:opacity-90'
                            onClick={() => addComment(appointment._id)}
                          >
                            Add Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  :
                  ''
                  }

                  {/* BUTTONS */}
                  {currentUser.role === 'technician'
                  ?
                    <div className="flex w-full justify-end">
                      <div className="flex flex-col justify-end gap-3">
                        <button onClick={() => handleAcceptAppointment(appointment._id)} className={`bg-green-700 text-white p-3 rounded-lg uppercase ${appointment.status !== 'Pending' ? '' : 'hover:opacity-95'} w-60 h-12`} disabled={appointment.status === 'Cancelled' || appointment.status === 'Refused' || appointment.status === 'Accepted'}>{appointment.status === 'Cancelled' ?" Appointment Cancelled" : appointment.status === 'Refused' ? "Appointment Refused" : appointment.status === 'Pending' ? "Accept" : 'Accepted'}</button>

                        <button onClick={() => handleRefuseAppointment(appointment._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12' disabled={appointment.status === 'Cancelled' || appointment.status === 'Refused'}>{appointment.status === 'Cancelled' ? " Appointment Cancelled" : "Refuse"}</button>
                      </div>
                    </div>
                  :
                    ''
                  }
                  {currentUser.role === 'user'
                  ?
                  <div className="flex w-full justify-end">
                    <div className="flex flex-col justify-end gap-3">
                      <button className={`bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12`} disabled={appointment.status === 'Cancelled' || appointment.status === 'Refused'}>Modifier</button>
                      <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12' disabled={appointment.status === 'Cancelled' || appointment.status === 'Refused'}>Consulter Facture</button>
                      <button onClick={() => handleCancelAppointment(appointment._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12' disabled={appointment.status === 'Cancelled' || appointment.status === 'Refused'}>{appointment.status === 'Cancelled' ?" Appointment Cancelled" : "Cancel Appointment"}</button>
                    </div>
                  </div>
                  :
                    ''
                  }
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
