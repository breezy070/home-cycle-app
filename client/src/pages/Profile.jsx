import { useSelector } from "react-redux"
import { useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure, signInFailure } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const {currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  };
  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-left my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept="image/*"/>
        <img src={currentUser.profilePicture} onClick={() => {fileRef.current.click()}} alt="profile" className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' />
        <input defaultValue={currentUser.first_name} type="text" id="first_name" placeholder="First Name" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <input defaultValue={currentUser.last_name} type="text" id="last_name" placeholder="Last Name" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <input defaultValue={currentUser.email} type="text" id="email" placeholder="E-email" className="bg-green-100 rounded-lg p-3" onChange={handleChange}/>
        <input type="password" id="password" placeholder="Password" className="bg-green-100 rounded-lg p-3"onChange={handleChange} />

        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" >{loading ?'Loading' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went wrong'}</p>
      <p className="text-green-700 mt-5">{updateSuccess && 'User has been updated !'}</p>
    </div>
  )
}
