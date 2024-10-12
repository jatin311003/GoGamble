const mongoose=require('mongoose');


const connection=mongoose.connect('mongodb://127.0.0.1:27017/coinflip',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>console.log('MongoDb Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports=connection