// Import db.js

const db = require('./db')

// Import jsonwebtoken
const jwt = require('jsonwebtoken')

// register

const register = (uname, acno, pswd) => {

    // asynchronous
    // check acno is in mongodb - db.users.findOne
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);
        if (result) {
            // acno already exist
            return {
                statusCode: 401,
                message: 'Account already exist'

            }
        }
        else {
            // To use new  user
            const newUser = new db.User({
                username: uname,
                acno,
                password: pswd,
                balance: 0,
                transaction: []
            })

            // To save new user in mongodb use  save()
            newUser.save()
            return {
                statusCode: 200,
                message: 'Registration Successfull'
            }
        }
    })

}

// login 
const login = (acno, pswd) => {
    console.log('inside login function body');
    account = Number(acno)
    // check acno,pswd in mongodb
    return db.User.findOne({
        acno: account,
        password: pswd
    }).then(
        (result) => {
            if (result) {
                // generate token
                const token = jwt.sign({
                    currentAcno: acno
                }, 'qwerty')
                return {
                    statusCode: 200,
                    message: 'login successful',
                    username: result.username,  // to display username in the frontend after login
                    currentAcno: acno,
                    token
                }
            }
            else {
                return {
                    statusCode: 404,
                    message: 'Invallid account / password'
                }
            }
        }
    )

}

// get balance

const getBalance = (acno) => {
    return db.User.findOne({
        acno
    }).then(
        (result) => {
            if (result) {
                return {
                    statusCode: 200,
                    balance: result.balance,  // to display balance in the frontend 
                }
            }
            else {
                return {
                    statusCode: 404,
                    message: "Invalid Account"
                }
            }
        }
    )

}

// deposit
const deposit = (acno, amt) => {
    let amount = Number(amt)
    return db.User.findOne({
        acno
    }).then((result) => {
        if (result) {
            //acno is present db
            result.balance += amount
            // To reflect in mongo db transfer status
            result.transaction.push({
                type: 'CREDIT',
                fromAcno: acno,
                toAcno: acno,
                amount
            })
            // to update in mongoDb
            result.save()
            return {
                statusCode: 200,
                message: `${amount} successfully deposited`
            }
        }
        else {
            return {
                statusCode: 404,
                message: 'invalid account'
            }
        }

    })
}

// fund transfer
const fundTransfer = (req, toAcno, pswd, amt) => {
    let amount = Number(amt)
    let fromAcno = req.fromAcno
    return db.User.findOne({
        acno: fromAcno,
        password: pswd
    }).then((result) => {
        console.log(result);
        if (result) {
            if (fromAcno == toAcno) {
                return {
                    statusCode: 401,
                    message: 'Transfer denied to the same account '
                }
            }
            // debit account holder details
            let fromAcnoBalance = result.balance
            console.log(fromAcnoBalance);
            if (fromAcnoBalance >= amount) {
                result.balance = fromAcnoBalance - amount
                // credit account details
                return db.User.findOne({
                    acno: toAcno
                }).then(creditdata => {
                    if (creditdata) {
                        creditdata.balance += amount
                        // To reflect in mongo db transfer status
                        creditdata.transaction.push({
                            type: 'CREDIT',
                            fromAcno,
                            toAcno,
                            amount
                        })
                        creditdata.save();
                        result.transaction.push({
                            type: 'DEBIT',
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result.save();

                        return {
                            statusCode: 200,
                            message: 'Amount transfered successfully'
                        }

                    }
                    else {
                        return {
                            statusCode: 401,
                            message: 'Invalid credit account number'
                        }
                    }
                })
            }
            else {
                return {
                    statusCode: 403,
                    message: 'Insufficient Balance'
                }
            }

        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid debit account number or Password'
            }
        }
    })
}

//Get all transactions

const getAllTransactions = (req) => {
    let acno = req.fromAcno
    return db.User.findOne({
        acno
    }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                transaction: result.transaction
            }
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid account number '
            }
        }
    })
}

// deleteMyAccount

const deleteMyAccount = (acno)=>{
    return db.User.deleteOne({
        acno
    })
    .then(
        (result)=>{
            if(result){
                return {
                    statusCode:200,
                    message: "Account deleted successfully"
                }
            }
            else{
                return {
                    statusCode:401,
                    message:"Invalid account"
                }
            }
        }
    )
}

// export
module.exports = {
    register,
    login,
    getBalance,
    deposit,
    fundTransfer,
    getAllTransactions,
    deleteMyAccount
}