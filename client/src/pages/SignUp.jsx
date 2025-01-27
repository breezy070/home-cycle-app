import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
    // console.log(formData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // console.log(formData);
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return
      }
      navigate('/sign-in');
      setError(false);
      // console.log(data);
    } catch (error) {
      setLoading(false);
      setError(true);
      // console.error('Network error:', error.message);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>User Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='First Name' id='first_name' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="text" placeholder='Last Name' id='last_name' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="text" placeholder='E-mail' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="text" placeholder='Address' id='address' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} type='submit' className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-60'>{loading ? 'Loading...' : 'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account ?</p>
        <Link to='/sign-in'>
          <span className='text-blue-500'>Sign in</span> 
        </Link>
      </div>
      <p className='text-red-100 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  )
}
