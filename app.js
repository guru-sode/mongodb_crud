const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const path = require('path');

const db = require('./db');
const collection = 'users';

app.get('/getUsers', (req, res) =>{
  db.getDB().collection(collection).find({}).toArray((err, documents)=>{
    if(err){
      console.log('Error in getting users');
      res.status(500)
    }
    else{
      console.log('Getting documents');
      res.json(documents);
      }
  })
});

app.post('/',(req, res) => {
  const userInput = req.body;
  db.getDB().collection(collection).findOne({email: userInput.email},(err,result)=>{
    if(result){
      res.send('user mail id already exists!!!')
      return
    }
  })
  db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
    if(err){
      console.log('Error in adding user');
      res.status(500)
      return
    }
    else{
      if(userInput.phone.length > 10){
        res.send('Phone number can be maximum of 10 digits')
        res.status(500)
      }
      res.json({result : result, document: result.ops[0]});
    }
  })
});

app.delete('/deleteUser/:id',(req,res)=>{
  const userID = req.params.id;
  db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(userID)},(err,result)=>{
    if(err){
      console.log('Error in adding user');
    }
    else{
      res.json(result)
      return
    }
  })
});

db.connect((err) => {
  if(err){
    console.log('Unable to connect', err);
    process.exit(1);
  }
  else{
    app.listen(5000, () =>{
      console.log('Connected to database');
    })
  }
})