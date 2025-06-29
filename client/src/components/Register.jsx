import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate=useNavigate();
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');

    const handleRegister=async(e)=>{
        e.preventDefault();

        if(!username||!email||!password){
            setError('All fields are required !');
            return ;
        }

        setError('');
        try{
            const response=await fetch('https://gogamble-server-c9mu.onrender.com//api/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({username,email,password})
            })

            if(response.status===401){
                setError('User already exists');
                return ;
            }
            const data=await response.json();
            if(response.ok){
                navigate('/');
            }
            else{
                setError(data.error || 'Registration failed. Please try again.');
            }
        }
        catch(err){
            setError('Registration failed. Please try again.');
        }
    }
    const closeError = () => {
        setError('');
    };
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-800'>

        {/* Error */}

        {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-700 mb-4">{error}</p>
                        <button
                            onClick={closeError}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

         {/* form  */}

        <div className='bg-white p-8 rounded shadow-lg w-96'>
            <h2 className='text-2xl font-bold text-cneter mb-6 text-gray-800'>Register</h2>
            <form onSubmit={handleRegister}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2 ' htmlFor="">Username</label>
                    <input
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    id='username'
                    className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline'
                    placeholder='Enter your username' />
                    
                </div>
                <div className='mb-4'>
                    <label
                    htmlFor=""
                    className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                <input 
                type="text"
                id='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-light focus:outline-none focus:shadow-outline'
                placeholder='Enter your email'
                />
                </div>
                <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
                <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none ml-[100px] focus:shadow-outline w-[100px]">Register</button>
                
            </form>
            <div className='mt-4 text-center'>
                Already have an account?
                 <span className='ml-2 text-gray-900 font-extrabold'>
                    <Link to='/'>
                        Login
                    </Link>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Register;
