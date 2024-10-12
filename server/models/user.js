const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    balance:{type:Number,default:100}
});

const User=mongoose.model('User',userSchema);
module.exports=User;