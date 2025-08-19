import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../redux/user/userSlice";
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axiosInstance';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { userId } = useParams();
  const {loading, error } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/get-client-by-id/${userId}`);
        setUser(response.data.client);
        console.log(response.data.client)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data === false ) {
        dispatch(updateUserFailure(data));
        return;
      }
    //   dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
   
  };
  // console.log(currentUser.address)
  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-left my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept="image/*"/>
        <img src={user.profilePicture} onClick={() => {fileRef.current.click()}} alt="profile" className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' />
        <label htmlFor="first_name">{user.role === 'user' ? "User" : user.role === 'technician' ? "Technician": user.role === 'admin' ? "Admin" : "Admin"} Name</label>
        <input defaultValue={user.first_name} type="text" id="first_name" placeholder="First Name" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <label htmlFor="last_name">Last Name</label>
        <input defaultValue={user.last_name} type="text" id="last_name" placeholder="Last Name" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <label htmlFor="email">E-mail</label>
        <input defaultValue={user.email} type="text" id="email" placeholder="E-email" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <label htmlFor="address">Address</label>
        <input defaultValue={user.address ? user.address.addressString : "user.zone (need to fix this for technicians and admins"} disabled type="text" id="address" placeholder="Address" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <label htmlFor="address">Password</label>
        <input disabled={true} type="password" id="password" placeholder="Password" className="bg-green-100 rounded-lg p-3" onChange={handleChange} />

        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" >{loading ?'Loading' : 'Update'}</button>
        <button onClick={() => navigate(`/gestion-utilisateurs`)} className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" >Back</button>
      </form>
      <p className="text-red-700 mt-5">{error && 'Something went wrong'}</p>
      <p className="text-green-700 mt-5">{updateSuccess && 'User has been updated !'}</p>
    </div>
  )
}
