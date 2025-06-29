
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
const Gamble = () => {
    const location=useLocation();
    const {userId,username,balance:initialbalance,token}=location.state||{};
    const [bet,setBet]=useState('');
    const [flipping,setFlipping]=useState(false);
    const [result,setResult]=useState('');
    const [balance,setBalance]=useState(initialbalance);
    const [message,setMessage]=useState('');
    const [rankings,setRankings]=useState([]);
    const navigate=useNavigate();
    useEffect(() => {
        if(userId && token) {
            fetchUserBalance();
            fetchRankings();
        }
    }, [userId, token]);
    

    const fetchUserBalance=async()=>{
        try{
            const response=await fetch(`https://gogamble-server-c9mu.onrender.com/api/user/${userId}`,{
                headers:{
                    method: 'POST',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if(response.ok){
                const data=await response.json();
                setBalance(data.balance);
            }
            else{
                console.log('Failed to fetch user balance',response.statusText);
            } 
        } catch(error){
            console.log('Error fetching user balance', error);
        }
    }
    console.log("Fetch User Balance --> userId:", userId, "token:", token);

    const fetchRankings=async()=>{
        try{
            const response=await fetch('https://gogamble-server-c9mu.onrender.com/api/rankings');
            if(response.ok){
                const data= await response.json();
                setRankings(data);
            }
            else{
                console.error('Failed to fetch rankings:', response.statusText);
            }
        }
        catch(error){
            console.error('Failed to fetch rankings:', error);
        }
    }
    
    const handleBet=async(choice)=>{
        if(!bet){
            setMessage('Please enter a bet amount');
            return ;
        }
        if(bet>balance){
            setMessage('You do not have enough balance');
            return ;
        }

        setMessage('');
        setFlipping(true);
        setTimeout(async() => {
            let newBalance;
            const outcome=Math.random()>0.5 ? 'heads':'tails';
            setResult(outcome);

            if(choice===outcome){
                newBalance=balance+parseInt(bet);
                setMessage('You won the bet !');
            }
            else{
                newBalance=balance-parseInt(bet);
                setMessage('You lost the bet !');
            }
            setBalance(newBalance);
            setBet('');
            setFlipping(false);
            try{
                const response=await fetch('https://gogamble-server-c9mu.onrender.com/api/update-balance',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId:userId,
                        newBalance:newBalance
                    })
                });
                console.log(userId,newBalance)
                if(response.ok){
                    const data=await response.json();
                    fetchRankings();
                    fetchUserBalance();
                    console.log('Balance update response:', data);
                }
                else{
                    console.error('Failed to update balance:', response.statusText);
                }
            }
            catch(error){
                console.error('Error updating balance in DB:', error);
            }
            setFlipping(false);
        }, 1500);

    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };


  return (
    <div className=' min-h-screen bg-gradient-to-r from-blue-500 to-purple-600'>
        {/* Navbar */}
        <div className='bg-gray-300 shadow-md p-4 flex justify-between items-center'>
            <div className='text-xl font-bold text-gray-800'>Go Gamble</div>
            <div className='flex items-center space-x-6'>
                <span className='text-gray-800'>
                Welcome, <span className="font-bold">{username}</span>
                </span>
                <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                        Logout
                </button>
            </div>
        </div>
        <div className="flex min-h-screen">
        {/* Ranking sidebar */}
        <div className=' bg-white p-4 shadow-lg w-1/4'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4 text-center'>LeaderBoard🥇</h2>
            <ul>
                {rankings.map((user,index)=>(
                    <li key={user._id}
                    className={`${userId===user._id?'border border-black  bg-blue-500 text-white':'border-none '} flex justify-between mt-2 p-2 ${index===0?'bg-green-500 font-bold ':'text-gray-700'}`}
                    >
                        <span>{index+1}. {user.username}</span>
                        <span>${user.balance}</span>
                    </li>
                ))}
            </ul>

        </div>
        
            {/* GambleSection */}

        <div className='flex items-center justify-center flex-1'>

      <div className='bg-white p-8 rounded-lg shadow-lg w-96 text-center'>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Go Gamble 
        </h2>
        <p className="text-lg text-gray-600 mb-4">Current Balance: <span className="font-bold">${balance}</span></p>
        <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={bet}
                    onChange={(e)=>setBet(e.target.value)}
                    placeholder="Enter your bet amount"
                />
                <div className='flex justify-between mb-4'>
                    <button className='bg-green-500 hover:bg-green-700 font-bold py-2 px-4 text-white rounded focus:outline-none focus:shadow-outline ' onClick={() => handleBet('heads')}>
                    
                        Bet on Heads
                    </button>
                    <button className='bg-green-500 hover:bg-green-700 font-bold py-2 px-4 text-white rounded focus:outline-none focus:shadow-outline ' onClick={() => handleBet('tails')}>
                    
                        Bet on Tails
                    </button>
                </div>
                {
                    flipping ? (
                        <p className='text-gray-800'>Flipping the coin...</p>
                    ) : (
                        result && (
                            <p className={` text-2xl font-bold 
                            text-purple-600 `}>
                            {result.toUpperCase()}
                            </p>
                        )
                    )
                }
                {message&& <p className={`mt-4 ${message.includes('won')?'text-green-600':'text-red-600'}
                ${message.includes('won')?'text-4xl':'text-xl'} `}>{message}<span>{message.includes('won')?'🏆':'😭'}</span></p>}
                <p className='text-sm text-gray-500 mt-6'>
                    Gamble responsibily. Your current balance is:
                    <span>{balance}</span>
                </p>


      </div>
      </div>
      </div>
    </div>
  )
}

export default Gamble
