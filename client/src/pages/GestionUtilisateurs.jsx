import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import { useSelector, useDispatch } from "react-redux"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice";

export default function GestionUtilisateurs() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/admin/get-clients');
        setClients(response.data.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

    const handleDeleteUser = async (clientId) => {
        try {
        // dispatch(deleteUserStart());
        const res = await fetch(`api/user/delete/${clientId}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
            dispatch(deleteUserFailure(data));
            return;
        }
        const updatedClients = await axios.get('/api/admin/get-clients');
        setClients(updatedClients.data.clients);
        // dispatch(deleteUserSuccess(data));
        } catch (error) {
        dispatch(deleteUserFailure(error))
        }
        console.log("deleting user : " + clientId)
    }

  return (
    <div>
        <h2 className='text-3xl text-start font-semibold p-10'>Liste Clients</h2>
        {!clients.length ? (
            <div className="flex justify-center items-center text-center p-10">
              <p className="text-xl text-red-500">
                Aucun client trouvé.
              </p>
            </div>
            ) : (
            <div className='flex flex-col gap-10 p-10'>
              {clients.map((client) => (
                <div key={client._id} className={`flex flex-row gap-10 w-full rounded-xl p-5`}>
                    {/* PROFILE IMAGES */}
                    <img 
                        src={client.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt={client.first_name || 'Client'} 
                        className='object-cover max-w-44 max-h-44 rounded-xl'
                    />

                    <div className= 'flex flex-col justify-between w-fit'> 

                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>First Name: {client.first_name}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Last Name: {client.last_name}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-yellow-600`}>Email: {client.email}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-green-600`}>Address: {client.address.addressString}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-black-600`}>Account created : {new Date(client.createdAt).toLocaleString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex w-full justify-end">
                        <div className="flex flex-col justify-end gap-3">
                        <button onClick={() => navigate(`/profile-by-id/${client._id}`)} className={`bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12`} >Profile</button>
                        <button onClick={() => handleDeleteUser(client._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Delete User</button>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          )}
    </div>

  )
}
