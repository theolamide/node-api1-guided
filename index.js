//import express from 'express'; //ES Modules
//in node.js we will import files using this syntax
const express = require('express'); //Commonj JSmodules
const db = require('./data/hubs-model.js'); //<<<1: import the database file

const server = express();
server.use(express.json()); //<<<this is needed to parse json from the body

server.get('/', (req, res)=>{
    res.send({api: 'Up and running'})
})

//list of hubs GET /hubs <<<2: implement endpoint
server.get('/hubs', (req, res)=>{
    //get the list of hubs from the database
    db.find()
    .then(hubs => {
        res.status(200).json(hubs)
    })
    .catch(error => {
        console.log('error on GET /hubs', error);
        res
            .status(500)
            .json({errorMessage: 'error getting list of hubs from database'})
    })
})

//add a hub
server.post("/hubs", (req, res) =>{
    //get data sent from client
    const hubData=req.body;//express does not know how to parse json. It needs to be taught how to do it.

    //call the db and add the hub
    db.add(hubData)
    .then(hub =>{
        res.status(201)
        .json(hub);
    })
    .catch(error => {
        console.log('error on POST /hubs', error);
        res
            .status(500)
            .json({errorMessage: 'error adding the hub'})
    })
})

//remove a hub using ID
server.delete('/hubs/:id',(req,res) =>{
    const id = req.params.id;

    db.remove(id)
    .then(removed =>{
        if(removed){
            //there is not hub with that id
            res.status(200)
            .json({message:'hub removed'})
            
        } else {
            res.status(404)
            .json({message: 'hub not found'});
        }
    })
    .catch(error => {
        console.log('error on DELETE /hubs', error);
        res
            .status(500)
            .json({errorMessage: 'error deleting hub'})
    })
})

//update a hub, passing the hub id and the changes

const port=4000;
server.listen(port, () => 
console.log(`\n ** API running on port ${port} **\n`));