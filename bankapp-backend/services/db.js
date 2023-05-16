             //data base connection with nodejs

//1 import mongoose
const mongoose=require("mongoose"); 

//define a connection string(make connection with mongodb)
mongoose.connect('mongodb://127.0.0.1:27017/bankserver')//change

//create a model and schmea for storing data into the data base
//model-User schema-{}
//model in express same as mongodb collection
const User=mongoose.model('User',{//schema
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//export the collection(use in another file)
module.exports={User}