const express = require('express');
const sessions=require('../data/sessions.json')
const debug=require('debug')('app:sessionsRouter');
const {MongoClient,ObjectId}=require('mongodb');
const sessionsRouter=express.Router();
const path=require('path')
const speakerService=require('../services/speakerService')

sessionsRouter.use((req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.redirect('/auth/signin');
    }
})

sessionsRouter.use(express.static(path.join(__dirname,'../../public/')));
sessionsRouter.route('/')
.get((req,res)=>{
    const url='mongodb+srv://dbUser:dev1234@globomantics.wzbysdf.mongodb.net/?retryWrites=true&w=majority'

    const dbName='globomantics';

(async function mongo(){
    let client;
    try {
        client=await MongoClient.connect(url);
        debug('connected to mongodb')

        const db=client.db(dbName);

        const sessions = await db.collection('sessions').find().toArray();
        res.render('sessions',{sessions});
    } catch (error) {
        debug(error.stack);
    }
    client.close();
})();
})

sessionsRouter.route('/:id')
.get((req,res)=>{
    const id= req.params.id;
    const url='mongodb+srv://dbUser:dev1234@globomantics.wzbysdf.mongodb.net/?retryWrites=true&w=majority'

    const dbName='globomantics';

(async function mongo(){
    let client;
    try {
        client=await MongoClient.connect(url);
        debug('connected to mongodb')

        const db=client.db(dbName);

        const session = await db.collection('sessions').findOne({_id:new ObjectId(id)});

        const speaker = await speakerService.getSpeakerById(session.speakers[0].id);

        session.speaker = speaker.data;
        res.render('session',{
            session
        })
    } catch (error) {
        debug(error.stack);
    }
    client.close();
})();
    
})

module.exports=sessionsRouter;