const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const path = require('path');

const db = require('./db');
const collection = 'users';

app.get('/getUsers', (req, res) =>{
  db.getDB().collection(collection).find({}).toArray((err, documents)=>{
    if(err)
      console.log('Error in getting users');
    else{
      console.log('Getting documents');
      res.json(documents);
      }
  })
});

app.post('/',(req, res) => {
  const userInput = req.body;
  db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
    if(err)
      console.log('Error in adding user')
      else{
        res.json({result : result, document: result.ops[0]});
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