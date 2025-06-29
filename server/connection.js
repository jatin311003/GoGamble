const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Atlas Connected"))
.catch(err => console.log("DB Connection Error:", err));
