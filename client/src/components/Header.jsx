import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropdown from "./profileDropDown";


export default function Header() {
    const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='bg-transparent'>
        <div className='flex justify-between p-10'>
            <Link to='/'>
                <h1 className='font-bold'>HomeCycleHome</h1>
            </Link>
            <ul className='flex gap-4'>
                <Link to='/'>
                    <li>Home</li>
                </Link>
                <Link to='/about'>
                    <li>About</li>
                </Link>
                    {currentUser ? (
                        <ProfileDropdown profilePicture={currentUser.profilePicture}/>
                    ) : (
                        <Link to='/sign-in'>
                            <li>Sign in</li>
                        </Link>
                        
                    )}
                    
            </ul>
        </div>
    </div>
  )
}
