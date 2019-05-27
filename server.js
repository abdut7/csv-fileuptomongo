var express =   require("express");  
var multer  =   require('multer');  
var csv = require("fast-csv");
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";


const cs=require('csvtojson')

var app =   express();  
var filenm='';
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './uploads');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
    filenm = file.originalname
    console.log(filenm);


  }  
});  
var upload = multer({ storage : storage}).single('myfile');  
  
app.get('/',function(req,res){  
      res.sendFile(__dirname + "/index.html");  
});  
  
app.post('/uploadjavatpoint',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file."+err);  
        }  
        res.end("File is uploaded successfully!"); 
        cs().fromFile("./uploads/"+filenm)
        .then((jsonObj)=>{
            console.log(jsonObj);
          
            MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
              if (err) throw err;
              var dbo = db.db("gkzdb");
              dbo.collection("customers").insertMany(jsonObj, (err, res) => {
              if (err) throw err;
              console.log("Number of documents inserted: " + res.insertedCount);
              /**
                Number of documents inserted: 5
              */

             dbo.collection("customers").find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result) });
              db.close();
              });
            });
          
          })

         
//         csv
//  .fromPath("./uploads/"+filenm).then(JSONO)
//  .on("data", function(data){
//      console.log(data);
//  })
//  .on("end", function(){
//      console.log("done");
//  });

    });  
});  
  
app.listen(2000,function(){  
    console.log("Server is running on port 2000");  
});  