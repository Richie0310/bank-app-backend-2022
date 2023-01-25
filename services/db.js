//  Import mongoosr in db.js file

const mongoose = require('mongoose')

// using mongoose define connection string and connect the db (bank)

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('MongoDB Connected Successfully');
})

// Create model(collection) for the project
// collection - users

const User = mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

// Export module to Mongo DB

module.exports={
    User
}
