const express = require("express");
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    extended: true
}));

var session = require('express-session')

// To use the session middleware
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

const cors = require('cors');
app.use(cors())

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img", express.static("./img"))


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html")
})

function filter_password(data) {
    return data.password
}

app.post("/login", function (req, res) {
    console.log("post request recieved")
    console.log(req.body.name, req.body.password)
    username = req.body.name
    pass = req.body.password

    userModel.find({ username: username }, function (err, user) {
        console.log(`entered: ${pass}, in db: ${user}`)
        var full_info = user
        console.log("Full Info: ", full_info)
        if (err) {
            console.log(err)
        }
        else {
            user = user.map(filter_password)
            console.log(user[0])
            if (req.body.password == user[0]) {
                id = full_info[0]._id
                req.session.real_user = full_info
                // console.log(req.session.real_user = full_info)
                console.log(full_info)
                req.session.authenticated = true
                res.send(req.session.real_user)
            }
            else {
                req.session.authenticated = false
                res.send("incorrect information")
            }
        }
    })
    // res.send({"stuff": username, "stuff2": pass})
})

app.get("/signOut", function (req, res) {
    req.session.authenticated = false
    res.send("Signed out successfully!")
})

app.get("/poke", function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(__dirname + "/poke.html")
    }
    else {
        res.redirect("/")
    }
})

app.listen(process.env.PORT || 5010, function (err) {
    if (err)
        console.log(err);
})

const mongoose = require('mongoose');
const { request } = require("express");
const { name } = require("ejs");
const { Router } = require("express");

mongoose.connect("mongodb+srv://lzh9459:BGcoIifOP19wZOLE@cluster0.jecig.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    _id: Object,
    name: String,
    password: String,
    email: String,
    username: String
});

const userModel = mongoose.model("users", userSchema);

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.put('/addNewUser', function (req, res) {
    userModel.create({
        '_id': Object,
        'name': req.body.name,
        'password': req.body.password,
        'email': req.body.email,
        'username': req.body.username
    }, function (err, data) {
        if (err) {
            console.log("Error: " + err)
        } else {
            console.log("Data: " + data)
        }
        res.send("Data sent successfully.")
    })
})

app.get('/thanks', function (req, res) {
    res.sendFile(__dirname + "/thanks.html")
})

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + "/signup.html")
})

