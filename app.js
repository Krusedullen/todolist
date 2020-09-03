const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js") //this is a local module that we wrote and added to our project
const mongoose = require("mongoose");

const app = express();


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "no name defined for list entry"]
  }
});

//specifies the model Item and what schema it is supposed to follow. Mongoose model start with a capital letters.
const Item = mongoose.model("Item", itemsSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err)
    } else {
      //let day = date.getDate();
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

app.post("/", function(req, res) {
  let item = req.body.newItem;
  const newItem = new Item({
    name: item
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  console.log(req.body.checkedItem);
  const checkedItemId = req.body.checkedItem;
  //the delete action NEEDS a callback function, even if it is just to check for errors
  Item.deleteOne({_id: checkedItemId}, function(err){
    if(err) console.log(err);
  });
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});


// inserts all the items in the array "items" into the database
// const items = [firstItem, secondItem, thirdItem];
// Item.insertMany(items, function(err){});
//
