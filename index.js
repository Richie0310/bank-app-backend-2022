// Import express inside index.js
const express = require('express')

// import cors in index.js
const cors = require('cors')

// import dataservice

const dataService = require('./services/dataService')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

//Create server application using express
const server = express()

// using cors 

server.use(cors({
    origin: 'http://localhost:4200'
}))

// To parse json data
server.use(express.json())

// Set up port for server app
server.listen(3000, () => {
    console.log('server started at 3000');
})

// get http api call

// server.get('/',(request,response)=>{ // request from frontend, and response from backend
//     response.send('GET METHOD')
// })

// server.post('/',(req,res)=>{
//     res.send('Post method')
// })

// server.put('/',(req,res)=>{
//     res.send('PUT METHOD')
// })

// server.delete('/',(req,res)=>{
//     res.send('DELETE METHOD')
// })

// application specific middleware
const appMiddleware = (req, res, next) => {
    console.log('inside application specific middleware');
    next()
}
server.use(appMiddleware)

// token verify middleware

const jwtMiddleware = (req, res, next) => {
    console.log('inside router specific middleware');
    // get token from req headers
    const token = req.headers['tok-access']
    try {
        // verify token
        const data = jwt.verify(token, 'qwerty')
        console.log(data);
        req.fromAcno = data.currentAcno
        console.log('valid token');
        next()
    }
    catch {
        console.log('invalid token');
        res.status(401).json({
            message: 'please login'
        })
    }
}

// bankapp front end request resolving


// register api call resolving

server.post('/register', (req, res) => {
    console.log('inside register function');
    console.log(req.body);
    //asynchronous
    dataService.register(req.body.uname, req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// Login api call resolving    

server.post('/login', (req, res) => {
    console.log('inside login function');
    console.log(req.body);
    //asynchronous
    dataService.login(req.body.acno, req.body.pswd)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// get balance api call 

server.get('/getBalance/:acno', jwtMiddleware, (req, res) => {
    console.log('inside getBalance Api');
    console.log(req.params.acno);
    //asynchronous
    dataService.getBalance(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// deposit api 

server.post('/deposit', jwtMiddleware, (req, res) => {
    console.log('inside deposit Api');
    console.log(req.body);
    //asynchronous
    dataService.deposit(req.body.acno,req.body.amount)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// fundTransfer api 

server.post('/fundTransfer', jwtMiddleware, (req, res) => {
    console.log('inside fundTransfer Api');
    console.log(req.body);
    //asynchronous
    dataService.fundTransfer(req,req.body.toAcno,req.body.pswd,req.body.amount)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})

// get all transaction

server.get('/all-transactions',jwtMiddleware,(req,res)=>{
    console.log('inside getAllTransactions api');
    dataService.getAllTransactions(req).then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// delete-account api

server.delete('/delete-account/:acno', jwtMiddleware, (req, res) => {
    console.log('inside getBalance Api');
    console.log(req.params.acno);
    //asynchronous
    dataService.deleteMyAccount(req.params.acno)
        .then((result) => {
            res.status(result.statusCode).json(result)

        })
})