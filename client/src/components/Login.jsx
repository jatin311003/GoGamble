import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
const Login = () => {
    const navigate=useNavigate();
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');

    const handleLogin=async(e)=>{
        e.preventDefault();
        if(!email||!password){
            setError('All fields are required.');
        }

        setError('');
        try{
            const response=await fetch('http://localhost:7200/api/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({email,password}),
            });
            const data=await response.json();
            if(response.ok){
                localStorage.setItem('token',data.token);
                localStorage.setItem('balance', data.balance);
                localStorage.setItem('username',data.username);
                localStorage.setItem('userId',data.userId)
                const userData={
                    userId:data.userId,
                    username:data.username,
                    balance:data.balance,
                    token:data.token
                }
                navigate('/gamble',{
                    state:userData
                });
            }
            else{
                setError('Login Failed. Please try again.');
            }
        }
        catch(error){
            setError('Login failed. Please try again.');
        }
    }
    const closeError=()=>{
        setError('');
    }
    
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-800'>
        {/* Error Popup */}
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
      <div className='bg-white p-10  rounded-lg shadow-lg w-96'>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>Login</h2>
        {/* {error & <p className='text-red-600 text-center mb-4'>{error}</p>} */}
        <form onSubmit={handleLogin}>
            <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>Email</label>
                <input 
                type="email"
                id='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                placeholder='Enter your Email'
                 />
            </div>
            <div className='mb-6'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                    Password
                </label>
                <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                placeholder='Enter your password' />
            </div>
            
            <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-[100px] w-[100px] '
            >Login</button>
            <div className='mt-4 text-center'>
                Don't have an account
                 <span className='ml-2 text-gray-900 font-extrabold'>
                    <Link to='/register'>
                        Register
                    </Link>
                </span>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
