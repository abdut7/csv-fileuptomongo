const express = require('express')
const app = express()
const port = 3001

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


app.get('/', (req, res) =>
res.sendFile((__dirname + '/index.html')))


app.get('/upload',(req,ress)=> {
   
   

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var obj= {
            regno:'23',
            password:'45'

        }
        dbo.collection("customers").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          ress.send('saved to db');
          dbo.collection("customers").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
      }); 
  //  console.log(req.query.reg);
})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))