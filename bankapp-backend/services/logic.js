//import db.js
const db = require('./db')

//import jwt token
const jwt = require('jsonwebtoken')

//logic for register callback function-asyncrronous fn
const register = (acno, username, password) => {
    console.log("inside the registerwork");
    //acno in db?yes
    return db.User.findOne({ acno }).then((response) => {
        // console.log(response);
        if (response) {
            return {
                statusCode: 401,
                message: 'acno is already registerd'
            }
        }
        else {
            //new object for registration
            const newUser = new db.User({
                acno,
                username,
                password,
                balance: 2000,
                transaction: []
            })
            //save to database
            newUser.save()
            //to send request back to the client
            return {
                statusCode: 200,
                message: 'sucsessfully registered'
            }

        }
    })

}
//logic for login
const login = (acno, password) => {
    console.log("inside the login function");
    return db.User.findOne({ acno, password }).then((result) => {
        //acno is present in the data base
        if (result) {
            //token genrated
            const token = jwt.sign({ loginAcno: acno }, 'superkey2023')
            return {
                statusCode: 200,
                message: 'successfully login',
                currentuser: result.username,
                token, //send to the client

                currentAcno: acno//sent to client..login.ts
            }
        }
        //acno mot present

        else {
            return {
                statusCode: 401,
                message: 'invalid data'
            }
        }
    })

}

//logic for dashboard balance enquire
const getbalance = (acno) => {
    //check acno in db
    return db.User.findOne({ acno }).then((result) => {//content in result
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance
            }

        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid data'
            }
        }

    })

}
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{

    //convert amt into number
    let amount=parseInt(amt)
    //check fromacno in  mongodb
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnoPswd
    }).then((debitdetails)=>{
        if(debitdetails){
        //to check toacno
        return db.User.findOne({acno:toAcno}).then((creditDetails)=>{
            if(creditDetails){
                //check the balance amount
                if(debitdetails.balance>amount){
                    debitdetails.balance-=amount;
                    debitdetails.transaction.push({
                        type:"Debit",
                        amount,
                        fromAcno,
                        toAcno
                    })
                    //save changes to the mongodb
                    debitdetails.save()


                    //update to the toacno
                    creditDetails.balance+=amount
                    creditDetails.transaction.push({
                        type:"Credit",
                        amount,
                        fromAcno,
                        toAcno
                    })
                    //save to mongodb
                    creditDetails.save()

                    //send response to the client side
                    return{
                        statusCode:200,
                        message:'Fund transfer successfull'
                    } 
                }
                else{
                    return{
                        statusCode:401,
                        message:'Insufficent balance'
                    } 
                }
            }
            else{
                return{
                    statusCode:401,
                    message:'invalid1 data'
                } 
            }
        })
        }
        else{
            return{
                statusCode:401,
                message:'invalid data'
            }
        }
    })
}


const getTransactionHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:'invalid data'
            }
        }
    })

}

const deleteUserAccont=(acno)=>{
    //acno delete from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:'Account deleted successfully'
        }
    })

}

//export the function for register,login,balance
module.exports = { register, login, getbalance, fundTransfer, getTransactionHistory,deleteUserAccont }
