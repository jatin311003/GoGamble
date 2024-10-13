const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cors=require('cors');
JWT_SECRET="HELLO_WORLD"
const connection=require('./connection');
const User=require('./models/user');
const app=express();
const PORT=7200;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

// Authentication Middleware

const auth=(req,res,next)=>{
    const token=req.header('Authorization');
    if(!token){
        return res.status(401).json('Access Denied');
    }
    try{
        const verified=jwt.verify(token,JWT_SECRET);
        req.user=verified;
        next();
    }
    catch(error){
        res.status(400).json('Invalid token');
    }
}

// Register Route
app.post('/api/register', async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(401).json({error:"All fields are required"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(401).json({message:"User already exist"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({username,email,password:hashedPassword});
        await newUser.save();
        res.status(200).json({Message:"User registered Successfully"});
    }
    catch(error){
        res.status(500).json('Server error');
    }
    
})

// Login Route
app.post('/api/login',async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(401).json({error:"User does not exist"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({error:"Invalid Email or Password"});
    const token=jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'1h'});
    res.status(200).json({balance:user.balance,username:user.username,token,userId:user._id});
})


// Coin Flip Route
app.post('/api/coinflip',auth, async(req,res)=>{
    const {choice,betAmount}=req.body;
    const user=await User.findById(req.user.id);

    if(betAmount>user.balance){
        return res.status(400).json('Insufficient balance');
    }

    const result=Math.random() < 0.5 ? 'heads': 'tails';

    let message;
    if(result===choice){
        user.balance+=betAmount;
        message=`You won! The coin landed on ${result}.`;
    }
    else {
        user.balance -= betAmount;
        message = `You lost. The coin landed on ${result}.`;
    }
    await user.save();
    res.status(200).json({ message, balance: user.balance });
})


app.get('/api/rankings',async(req,res)=>{
    try{
        const users=await User.find().sort({balance:-1}).select('username balance');
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({error:'Failed to retrieve rankings'})
    }
})

app.post('/api/update-balance', async(req,res)=>{
    const {userId,newBalance}=req.body;
    try{
        const user= await User.findById(userId);
        if(!user) return res.json({message:'User not found'});
        user.balance=newBalance;
        await user.save();
        res.status(200).json({userId:userId,balance:user.balance});
    }
    catch(error){
        res.status(500).json({message:'Server error'});
    }
})

app.post('/api/user/:userId',async(req,res)=>{
    try{
        const user= await User.findById(req.params.userId);
        if(!user){
            res.status(404).json({message:"User not found"});
        }
        res.status(200).json({balance:user.balance});
    }
    catch(error){
        console.log("Error fetching the balance",error);
        res.status(500).json({message:"Server Error"});
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

