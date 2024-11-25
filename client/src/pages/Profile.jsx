import { useSelector } from "react-redux"
import { useRef } from "react"

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-left my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept="image/*"/>
        <img src={currentUser.profilePicture} onClick={() => {fileRef.current.click()}} alt="profile" className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' />
        <input defaultValue={currentUser.first_name} type="text" id="firstName" placeholder="First Name" className="bg-green-100 rounded-lg p-3" />
        <input defaultValue={currentUser.last_name} type="text" id="lastName" placeholder="Last Name" className="bg-green-100 rounded-lg p-3" />
        <input defaultValue={currentUser.email} type="text" id="email" placeholder="E-email" className="bg-green-100 rounded-lg p-3" />
        <input type="password" id="password" placeholder="Password" className="bg-green-100 rounded-lg p-3" />

        <button className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
