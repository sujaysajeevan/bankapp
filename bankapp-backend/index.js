//1import express
const express=require("express")

//4import cors
const cors=require("cors")
//9 import logic.js
const logic=require('./services/logic')

//import jwttoken
const jwt =require('jsonwebtoken')

//2create server using express
const server=express()

//5use cors in server
server.use(cors({
    origin:"http://localhost:4200"
}))
//6convert data into the json formate
server.use(express.json())

// //7resolve client request just for understanding
// server.get("/",(req,res)=>{
//     res.send("get methord")
// })
// server.post("/",(req,res)=>{
//     res.send("post methord")
// })

//3stepup port for the server
server.listen(5000,()=>{
    console.log("listerning on the port 5000");
})

//application specific middlewere
const appMiddlewere=(req,res,next)=>{
    next()
    console.log('Application specific middlewere');
}
//use applocation s m
server.use(appMiddlewere)

//middlewere for varifing token to check usser is logined or not
const jwtMiddleware=(req,res,next)=>{
    //get tokenfrom req header
    const token=req.headers['verifytoken']; //token
    console.log(token);//token...varify token
try{
    const data=jwt.verify(token,'superkey2023')
    console.log(data);

    req.currentAcno=data.loginAcno
    next()
}
catch{
res.status(401).json({message:'please login'})//for error message
}

   
console.log('router specific middle were');

}

//8 creating http methords for every methords
//bank request
//register
//login
//balance enquire
//fund transferll

//register api call
// /=localhoset 5000
server.post('/register',(req,res)=>{
    console.log('inside the register api call');
    console.log(req.body);//for getting data in node terminal
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
   // res.send("registered request received")
    ////res.status(200).json({message:'request received'})
})

//logiin api call
server.post('/login',(req,res)=>{
    console.log('inside the login api call');
    console.log(req.body);//data inside body
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//api call for getbalance
server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{ 
 console.log(req.params.acno)
 logic.getbalance(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)
 });

})

//fund transfer api call
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('inside the fund transfer');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then(
        (result)=>{
            res.status(result.statusCode).json(result)
 
        }
    )
})

//gettramsaction api call
server.get('/getTransactionHistory',jwtMiddleware,(req,res)=>{
    console.log('inside the function');
    logic.getTransactionHistory(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)

    })
})

//delete acconunt
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
    console.log('inside delete account');
    logic.deleteUserAccont(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result)

    })
})
