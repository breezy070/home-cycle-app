import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { Link, useLocation } from "react-router-dom";

const ProfileDropdown = (props) => {
    
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const { currentUser } = useSelector((state) => state.user); // Access user data

  const handleSignOut = async () => {
    try {
      await fetch('api/auth/signout')
      //default method is GET
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseDropdown = () => {
    setIsOpen(false); // Explicitly close the dropdown
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Close dropdown when URL changes
    handleCloseDropdown();
  }, [location]);


  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon */}
      <img onClick={toggleDropdown} src={props.profilePicture} alt="profile" className="h-7 w-7 rounded-full object-cover cursor-pointer"/>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-green-200 rounded-lg shadow-lg z-[1000]">
          <ul className="flex flex-col py-2">
            <Link onClick={handleCloseDropdown} to='/profile' className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                    <div className="fa-solid fa-user w-5 h-5"></div>
                    <div>Profile</div>
                </div>
            </Link>
            {currentUser?.role === "admin"
              ?
                <Link onClick={handleCloseDropdown} to='/technician-zone-assignment' className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                      <div className="fa-solid fa-user w-5 h-5"></div>
                      <div>Assign Zone</div>
                  </div>
                </Link>
              :
              ''
            }
            <Link onClick={handleCloseDropdown} to='/achats' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                <span className="fa-solid fa-cart-shopping w-5 h-5"></span>
                <span>Achats</span>
            </div>
            </Link>
            <Link onClick={handleCloseDropdown} to='/interventions' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                <span className="fa-solid fa-calendar-check w-5 h-5"></span>
                <span>Interventions</span>
            </div>
            </Link>
            <Link onClick={handleCloseDropdown} to='/factures' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                <span className="fa-solid fa-receipt w-5 h-5"></span>
                <span>Factures</span>
            </div>
            </Link>
            <Link onClick={handleCloseDropdown} to='/velos' className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                <span className="fa-solid fa-bicycle w-5 h-5"></span>
                <span>Vélos</span>
            </div>
            </Link>
            <Link onClick={handleSignOut} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
            <div className="flex flex-row justify-start items-baseline gap-x-2 w-full ">
                <span className="fa-solid fa-right-from-bracket w-5 h-5"></span>
                <span>Sign Out</span>
            </div>
            </Link>
            {/* <li className="bg-red-50 rounded-sm" onClick={}>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                
              >
                Sign Out
              </a>
            </li> */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
