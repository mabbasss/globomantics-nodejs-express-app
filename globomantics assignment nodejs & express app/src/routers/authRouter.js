const express = require('express');
const debug=require('debug')('app:authRouter');
const {MongoClient,ObjectId}=require('mongodb');
const authRouter=express.Router();
const path=require('path');
const passport=require('passport');

authRouter.use(express.static(path.join(__dirname,'../../public/')));


authRouter.route('/signUp').post((req,res)=>{
    //CREATE USER
    const {username,password}=req.body;
    const url='mongodb+srv://dbUser:dev1234@globomantics.wzbysdf.mongodb.net/?retryWrites=true&w=majority'
    const dbName='globomantics';
    (async function addUser(){
        let client;
        try
        {
            client=await MongoClient.connect(url);
            const db=client.db(dbName);
            const user= {username,password};
            const results= await db.collection('users').insertOne(user);
            debug(results);
            req.login(results.insertedId,()=>{
                res.redirect('/auth/profile');
            })
        }
        catch(error)
        {
            debug(error);
        }
    }())

   
});

authRouter.route('/signIn').get((req,res)=>{
    res.render('signin');
}).post(passport.authenticate('local',{successRedirect:'profile',failureMessage:'/'}))

authRouter.route('/profile').get((req,res)=>{
    res.json(req.user);
})

module.exports=authRouter;