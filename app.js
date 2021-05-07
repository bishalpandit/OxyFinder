const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');

const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://bishalpandit:O4UILnCdYnlcaloZ@cluster0.s8c8e.mongodb.net/oxyfinder?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {

    console.log("Connected to DB");
})
.catch((err) => {

    console.log(err);
})


const userSchema = new mongoose.Schema(

    {
        name: String,
        phone: String,
        address: String
    }
);

autoIncrement.initialize(mongoose.connection);

userSchema.plugin(autoIncrement.plugin, {
    model: "User", 
    field: "_id", 
    startAt: 1, 
    incrementBy: 1, 
  }); 

const User = mongoose.model("User",userSchema);

app.get("/newrec", (req, res) => {

    res.render("newrec");
});



app.post('/newrec', (req,res) => {


    const newUser = new User({

        name: req.body.supplierName,
        phone: req.body.supplierNumber,
        address: req.body.supplierAddress

    });

    newUser.save( (err) => {

        if(!err) {

                res.redirect("/");
        }
    });


    
});

app.get("/", (req, res) => {

    User.find({}, (err, users) => {

        res.render('home', {

            usersList: users
        })
    }).sort( {

        _id: -1,
    })
})

app.get("/post/:id", (req, res) => {

    const id = req.params.id;

    User.findById(id, (err, user) => {

        res.render('post', {

            supp : user
        })
    })
})

app.get("/contact", (req, res) => {

    res.render("contact");
})

app.listen(process.env.PORT || 3000, () => {

    console.log("Server started on port 3000");
});
