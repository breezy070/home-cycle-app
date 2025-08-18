import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import { useSelector, useDispatch } from "react-redux"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice";

export default function GestionInterventions() {
  const [interventions, setInterventions] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all clients
  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await axios.get('/api/admin/get-interventions');
        setInterventions(response.data.interventions);
      } catch (error) {
        console.error('Error fetching interventions:', error);
      }
    };

    fetchInterventions();
  }, []);

  const handleDeleteIntervention = async (interventionId) => {
      try {
      // dispatch(deleteUserStart());
      const res = await fetch(`api/admin/delete-intervention/${interventionId}`, {
          method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
          // dispatch(deleteUserFailure(data));
          return;
      }
      const updatedInterventions = await axios.get('/api/admin/get-interventions');
      setInterventions(updatedInterventions.data.interventions);
      // dispatch(deleteUserSuccess(data));
      } catch (error) {
      // dispatch(deleteUserFailure(error))
      }
      console.log("deleting intervention : " + interventionId)
  }

  return (
    <div>
        <h2 className='text-3xl text-start font-semibold p-10'>Liste Interventions</h2>
        {!interventions.length ? (
            <div className="flex justify-center items-center text-center p-10">
              <p className="text-xl text-red-500">
                Aucune intervention trouvée.
              </p>
            </div>
            ) : (
            <div className='flex flex-col gap-10 p-10'>
              {interventions.map((intervention) => (
                <div key={intervention._id} className={`flex flex-row gap-10 w-full ${intervention.status === 'Pending' ? 'bg-orange-200' : intervention.status === 'Accepted' ? 'bg-green-200' : ''} ${intervention.status === 'Cancelled' || intervention.status === 'Refused' ? `bg-red-200 opacity-50` : ``} rounded-xl p-5`}>
                    {/* PROFILE IMAGES */}
                    {/* <img 
                        src={client.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt={client.first_name || 'Client'} 
                        className='object-cover max-w-44 max-h-44 rounded-xl'
                    /> */}

                    <div className= 'flex flex-row gap-10 w-full'> 

                        <p className={`w-fit p-1 font-bold  uppercase text-black-600`}>Intervention Date : {new Date(intervention.createdAt).toLocaleString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                        </p>

                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Status: {intervention.status}</p>
                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Client: {intervention.userId}</p>
                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Technician: {intervention.technicianId}</p>
                      
                      {/* BUTTONS */}
                      <div className="">
                          <div className="">
                            {/* <button onClick={() => navigate(`/profile-by-id/${client._id}`)} className={`bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12`} >Profile</button> */}
                            <button onClick={() => handleDeleteIntervention(intervention._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Effacer Intervention</button>
                          </div>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
    </div>

  )
}
