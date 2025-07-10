import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import { useSelector, useDispatch } from "react-redux"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice";

export default function GestionUtilisateurs() {
  // const [clients, setClients] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Source of truth for all users
  const [filteredUsers, setFilteredUsers] = useState([]); // To store filtered users
  const [filterRoles, setFilterRoles] = useState('All'); // Track the selected filter
  const [isModalOpen, setIsModalOpen] = useState(false); // Toggle modal visibility
  const [newUser, setNewUser] = useState({
    role: 'user', // Default role
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddUser = async () => {
    try {
      const response = await axios.post('/api/admin/add-users', newUser);
      if (response.data.success) {
        setIsModalOpen(false); // Close modal
        setNewUser({ role: 'user', first_name: '', last_name: '', email: '', address: '', password: '' }); // Reset form
        const updatedUsers = await axios.get('/api/admin/get-clients'); // Refresh users
        setAllUsers((prev) => [
          ...prev,
          { ...response.data.user, role: newUser.role },
        ]);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };


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
    setAllUsers(updatedClients.data.clients);
    // dispatch(deleteUserSuccess(data));
    } catch (error) {
    dispatch(deleteUserFailure(error))
    }
    console.log("deleting user : " + clientId)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [clientsResponse, adminsResponse, techniciansResponse] = await Promise.all([
          axios.get('/api/admin/get-clients'),
          axios.get('/api/admin/get-admins'),
          axios.get('/api/admin/technicians'),
        ]);
  
        // Combine all fetched users
        const allFetchedUsers = [
          ...clientsResponse.data.clients.map((user) => ({ ...user, role: 'user' })),
          ...adminsResponse.data.admins.map((user) => ({ ...user, role: 'admin' })),
          ...techniciansResponse.data.technicians.map((user) => ({ ...user, role: 'technician' })),
        ];
  
        setAllUsers(allFetchedUsers); // Store the unfiltered list of users
        setFilteredUsers(allFetchedUsers); // Initially show all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);
  
  const handleFilterChange = (e) => {
    setFilterRoles(e.target.value); // Update the selected filter
  };
  
  useEffect(() => {
    // Filter users based on the selected role
    if (filterRoles === 'All') {
      setFilteredUsers(allUsers); // Show all users
    } else {
      setFilteredUsers(allUsers.filter((user) => user.role === filterRoles)); // Filter by role
    }
  }, [filterRoles, allUsers]); // Depend on filterRoles and allUsers


  return (
    <div>

        <div className='flex justify-center mb-4'>
          <button onClick={() => setIsModalOpen(true)} className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Ajouter Utilisateur</button>
        </div>

        {/* Filter Input */}
        <div className="flex items-center justify-center p-5">
          <label htmlFor="filter" className="mr-3 text-lg font-semibold">Filter by Role:</label>
            <select
              id="filter"
              className="p-2 border border-gray-300 rounded-lg"
              value={filterRoles}
              onChange={handleFilterChange}
            >
              <option value="All">All</option>
              <option value="user">Client</option>
              <option value="admin">Admin</option>
              <option value="technician">Technician</option>
            </select>
        </div>

        <h2 className='text-3xl text-start font-semibold p-10'>Liste {filterRoles === 'All' ? 'Utilisateurs' : filterRoles === 'user' ? 'Clients' : filterRoles === 'technician' ? 'Techniciens' : 'Administrateurs'} ({filterRoles === 'All' ? allUsers.length : filteredUsers.length})</h2>
        {!filteredUsers.length ? (
            <div className="flex justify-center items-center text-center p-10">
              <p className="text-xl text-red-500">
                Aucun utilisateur trouvé.
              </p>
            </div>
            ) : (
            <div className='flex flex-col gap-10 p-10'>
              {filteredUsers.map((user) => (
                <div key={user._id} className={`flex flex-row gap-10 w-full rounded-xl p-5`}>
                    {/* PROFILE IMAGES */}
                    <img 
                        src={user.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt={user.first_name || 'Client'} 
                        className='object-cover max-w-44 max-h-44 rounded-xl'
                    />

                    <div className= 'flex flex-col justify-between w-fit'> 

                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>First Name: {user.first_name}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Last Name: {user.last_name}</p>

                        <p className={`w-fit p-1 font-bold  uppercase text-yellow-600`}>Email: {user.email}</p>
                        {user.role === 'user' ? 
                        <p className={`w-fit p-1 font-bold  uppercase text-green-600`}>Address: {user.role === 'user' ? user.address.addressString : ''}</p>
                        : ''
                        }
                        <p className={`w-fit p-1 font-bold  uppercase text-red-600`}>Role: {user.role}</p>
                        
                        <p className={`w-fit p-1 font-bold  uppercase text-black-600`}>Account created : {new Date(user.createdAt).toLocaleString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex w-full justify-end">
                        <div className="flex flex-col justify-end gap-3">
                        <button onClick={() => navigate(`/profile-by-id/${user._id}`)} className={`bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12`} >Profile</button>
                        <button onClick={() => handleDeleteUser(user._id)} className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 w-60 h-12'>Delete User</button>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Ajouter Utilisateur</h3>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              >
                <option value="user">Client</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
              </select>
              <input
                type="text"
                placeholder="First Name"
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              />
              <input
                type="address"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="mb-3 p-2 border border-gray-300 rounded-lg w-full"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
    </div>

  )
}
