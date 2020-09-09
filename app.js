const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js") //this is a local module that we wrote and added to our project
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//"mongodb://localhost:27017/todolistDB" - den lokale adressen for MongoDB i mongoose syntaks
mongoose.connect("mongodb+srv://admin-therese:lykketroll@cluster0.ruahq.mongodb.net/todolistDB?retryWrites=true&w=majority", {
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

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  List.findOne({
    name: "Today"
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("made new list: Today");
        const list = new List({
          name: "Today",
          items: []
        });
        list.save();
        res.redirect("/")

      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }


  });
});


app.get("/:customList", function(req, res) {
  const customName = _.capitalize(req.params.customList);

  //find one just returns one document rather than a whole array.
  List.findOne({
    name: customName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log("made new list: " + customName);
        const list = new List({
          name: customName,
          items: []
        });
        list.save();
        res.redirect("/" + customName)
      } else {
        //console.log("list exists");
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      };
    };
  });


});



app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const newItem = new Item({
    name: itemName
  });

  if (listName === "Today") {
    List.findOne({
      name: "Today"
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      if (!err) {
        setTimeout(function() {
          res.redirect("/" + listName);
        }, 500);
      }

    });
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      if (!err) {
        setTimeout(function() {
          res.redirect("/" + listName);
        }, 500);

      }

    });
  };
});

app.post("/delete", function(req, res) {
  //console.log(req.body.checkedItem);
  const checkedItemId = req.body.checkedItem;
  const listName = req.body.listName;

  if (listName === "Today") {
    //the delete action NEEDS a callback function, even if it is just to check for errors
    List.findOneAndUpdate({
        name: "Today"
      },
      // pull fra List et Item med _id lik checkedItemId
      {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      },
      //callback function
      function(err, fountList) {
        if (!err) {
          res.redirect("/");
        };
      });
  } else {
    //finne listen som inneholder det riktige itemet
    List.findOneAndUpdate({
        name: listName
      },
      // pull fra List et Item med _id lik checkedItemId
      {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      },
      //callback function
      function(err, fountList) {
        if (!err) {
          res.redirect("/" + listName);
        };
      });
  };


});

app.listen(3000, function() {
  console.log("server started on port 3000");
});


// inserts all the items in the array "items" into the database
// const items = [firstItem, secondItem, thirdItem];
// Item.insertMany(items, function(err){});
//
