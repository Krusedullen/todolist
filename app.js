const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){
  var today = new Date();
  var currentDay = today.getDay();
  if( currentDay === 6||currentDay === 0){
    res.send("Yay it is the weekend!");
  } else { res.send("it is a workday :/");}
});

app.listen(3000, function(){
  console.log("server started on port 3000");
});
