// const mysql = require("mysql");nn
const express = require("express");
const app = express();
const ejs = require('ejs');
const bcrypt = require('bcrypt')
app.set('view engine', 'ejs');

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));

var session = require('express-session')

const Joi = require('joi');

// To use the session middleware
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

const cors = require('cors');
app.use(cors())

const loginValidator = function (req, res, next) {
  if (req.session.authenticated != true) {
    res.redirect("/")
  }
  else {
    next()
  }
}

app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img", express.static("./img"))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
})

function filter_password(data) {
  return data.password
}

app.post("/login", function(req, res) {
  console.log("post request recieved")
  console.log(req.body.username, req.body.password)
  const loginValidationSchema = Joi.object().keys({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(5).required()
  })
  login_credentials = {
    "username": req.body.username,
    "password": req.body.password
  }
  console.log("login credentials", login_credentials)

  const {error, value} = loginValidationSchema.validate(login_credentials)
  if (error) {
    res.send(error.details[0].message)
  }
  else {
    userModel.find({username: req.body.username}, function(err, user) {
      // console.log(`entered: ${pass}, in db: ${user}`)
      var full_info = user
      console.log("Full Info: ", full_info)
      if (err) {
        console.log(err)
      }
      else {
        user = user.map(filter_password)
      console.log(user[0])
      bcrypt.compare(req.body.password, user[0], function(err, result) {
        if (err){
          req.session.authenticated = false
          res.send("error please try again")
        }
        else if (result) {
          id = full_info[0]._id
          req.session.real_user = full_info
          // console.log(req.session.real_user = full_info)
          console.log(full_info)
          req.session.authenticated = true
          if (req.session.real_user[0].type == "admin") {
            res.send("admin detected")
          } else {
            res.send("success")
          }
        } else {
          req.session.authenticated = false
          res.send("incorrect information")
        }
    });
      }
    })
  }
})

app.post("/adminLogin", function (res, req) {
  console.log("request recieved")
  console.log(req.body.username, req.body.password)
  username = req.body.username
  password = req.body.password
  const adminSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().min(5).required()
  })
  admin_credentials = {
    "username": req.body.username,
    "password": req.body.password
  }
  const {error, value} = adminSchema.validate(admin_credentials)
  if (error) {
    res.send(error.details[0].message)
  }
  else {
    userModel.find({username: username}, function (err, user) {
      console.log(`entered ${password} into db: ${user}.`)
      var full_info = user
      console.log("full info: ", full_info)
      if (err) {
        console.log(err)
      } else {
        if (req.body.password == user[0]) {
          id = full_info[0]._id
          req.session.full_user = full_info
          console.log(full_info)
          if (full_info[0].type == "admin") {
            req.session.authenticated = true
            res.send(req.session.real_user)
          } else {
            req.session.authenticated = false
            res.send("access denied")
          }
        } else {
          req.session.authenticated = false
          res.send("incorrect information")
        }
      }
    })
  }
})

app.get("/signOut", function(req, res) {
  req.session.authenticated = false
  res.send("Signed out successfully!")
})

app.get("/poke", loginValidator, function(req, res) {
  if (req.session.authenticated) {
    res.sendFile(__dirname + "/poke.html")
  }
  else {
    res.redirect("/")
  }
})

app.get("/getUserInfo", function(req, res) {
  userModel.find({username: req.session.real_user[0].username}, function(err, data) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + data)
      res.json(data)
    }
  })
})

app.post("/findUser", function(req, res) {
  userModel.find({username: req.body.username}, function(err, data) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + data)
      res.json(data)
    }
  })
})


app.listen(process.env.PORT || 5010, function (err) {
  if (err)
      console.log(err);
})

const mongoose = require('mongoose');
const { request } = require("express");
const { name } = require("ejs");
const { Router } = require("express");

mongoose.connect("mongodb+srv://mongodb+srv://lzh9459:BGcoIifOP19wZOLE@cluster0.jecig.mongodb.net/?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({ 
    _id:Object,
    name: String,
    password: String,
    type: String,
    email: String,
    username: String,
    phone: String,
});


// const usersSchema = new mongoose.Schema({
//   // _id: Object,
//   name: String,
//   email: String,
//   username: String,
//   phone: String,
//   img:String,
// })

const userModel = mongoose.model("users", userSchema);

app.get('/profile', (req,res) =>{ 
    userModel.find({name:req.session.real_user.name}, function(err,users)
     {
      res.render('profile', {
        name: req.session.real_user[0].name,
        email: req.session.real_user[0].email,
        username: req.session.real_user[0].username,
        phone: req.session.real_user[0].phone,
        img: req.session.real_user[0].img

      })
    })
})

app.post('/changeUsername', function (req, res) {
  const validateUsernameSchema = Joi.object().keys({
    username: Joi.string().required()
  })
  updated_username = {
    "username": req.body.username
  }
  const {error, value} = validateUsernameSchema.validate(updated_username)
  if (error) {
    res.send(error.details[0].message) 
  }
  else {
    userModel.updateOne({
      name: req.session.real_user[0].name
    }, {
      $set: {'username': req.body.username}
    }, function (err, data) {
      if (err) {
        console.log("Error: " + err)
      } else {
        console.log("Data: " + data)
        res.send("Successfully updated.")
      }
    }) 
  }
})

app.post('/changePassword', function (req, res) {
  const validatePasswordSchema = Joi.object().keys({
    password: Joi.string().min(5).required()
  })
  updated_password = {
    "password": req.body.password
  }
  const {error, value} = validatePasswordSchema.validate(updated_password)
  if (error) {
    res.send(error.details[0].message)
  }
  else {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        console.log("Err" + err)
      }
      else {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            console.log("Err" + err)
          }
          else {
            req.body.password = hash
            userModel.updateOne({
              name: req.session.real_user[0].name
            }, {
              $set: {'password': req.body.password}
            }, function (err, data) {
              if (err) {
                console.log("Error: " + err)
              } else {
                console.log("Data: " + data)
                res.send("Successfully updated.")
              }
            })
          }
        })
      }
    })
  }
})

app.post('/changeEmail', function (req, res) {
  const validateEmailSchema = Joi.object().keys({
    email: Joi.string().email({tlds: {allow: ["com"]}}).required()
  })
  updated_email = {
    "email": req.body.email
  }
  const {error, value} = validateEmailSchema.validate(updated_email)
  if (error) {
    res.send(error.details[0].message)
  }
  else {
    userModel.updateOne({
      name: req.session.real_user[0].name
    }, {
      $set: {'email': req.body.email}
    }, function (err, data) {
      if (err) {
        console.log("Error: " + err)
      } else {
        console.log("Data: " + data)
        res.send("Successfully updated.")
      }
    })
  }
})

app.post('/changePhoneNumber', function (req, res) {
  const validatePhoneSchema = Joi.object().keys({
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required()
  })
  updated_phone = {
    "phone": req.body.phone
  }
  const {error, value} = validatePhoneSchema.validate(updated_phone)
  if (error) {
    res.send(error.details[0].message)
  }
  else {
    userModel.updateOne({
      name: req.session.real_user[0].name
    }, {
      $set: {'phone': req.body.phone}
    }, function (err, data) {
      if (err) {
        console.log("Error: " + err)
      } else {
        console.log("Data: " + data)
        res.send("Successfully updated.")
      }
    })
  }
})

app.put('/insertRecord', (req, res) => {
  scoresModel.create({
    'name': req.session.real_user[0].username,
    'score': req.body.score
  }, function (err, data) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log ("Data: " + data)
    }
    res.send("Successfully inserted record.")
  })
})

app.get('/signup', function (req, res) {
  res.sendFile(__dirname + "/common/signup.html")
})

app.put('/addNewUser', function (req, res) {
  const validateUserSchema = Joi.object().keys({
    username: Joi.string().min(1).required(), // string, min of one char, required
    email: Joi.string().email({tlds: {allow: ["com"]}}).required(), // string, email, has to end with .com, required
    password: Joi.string().min(5).required(), // string, min of five chars, required
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required() 
  })// string, phone-format: XXX-XXX-XXXX, required
  validated_fields = {
    "username": req.body.username,
    "email": req.body.email,
    "password": req.body.password,
    "phone": req.body.phone
  }
  const {error, value} = validateUserSchema.validate(validated_fields)
  if (error) {
    console.log("Err" + error)
    res.send(error.details[0].message)
  }
  else {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        console.log("Err" + err)
      }
      else {
        bcrypt.hash(req.body.password, salt, function(err, hashed_password) {
          if (err) {
            console.log("Err" + err)
          }
          else {
            console.log("HASHED PASSWORD", hashed_password)
            req.body.password = hashed_password
            userModel.create({
              '_id': Object,
              'name': req.body.name,
              'password': req.body.password,
              'email': req.body.email,
              'type': 'user',
              'username': req.body.username,
              'phone': req.body.phone,
              'img': './img/profileicon.png',
              'category': "covid_safety",
              'education': "student",
              'quiz_scores': [{'category': 'covid_safety', 'high_score': 0, 'tried_quiz': false}, {'category': 'covid_information', 'high_score': 0, "tried_quiz": false}]
            }, function (err, data) {
              if (err) {
                console.log("Error: " + err)
              } else {
                console.log("Data: " + data)
              }
            })
            res.send("success")
          }
        })
      }
    })
  }
})

app.get('/thanks', function (req, res) {
  res.sendFile(__dirname + "/thanks.html")
})

app.get('/getRecords', (req, res) => {
  scoresModel.find({}, function (err, scores) {
    if (err) {
      console.log("Error: " + err)
    } else {
      console.log("Data: " + scores)
    }
    res.send(scores)
  })
})

app.get('/getUsers', function (req, res) {
  userModel.find({type: 'user'}, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
    res.send(data)
  })
})

app.delete("/removeUser", function(req, res) {
  // req.body.username subject to change, may be some other value being used for criteria
  userModel.deleteOne({username: req.body.username}, function(err, data) {
    if (err) {
      console.log("Err" + err)
    }
    else {
      console.log("Data" + data)
      res.send(`successful removal of ${req.body.username} from users collection.`)
    }
  })
})

app.post("/updateUserInfo", function(req, res) {
  console.log(req.body.password)
  criteria = {username: req.body.old_username}
  const validateUpdateSchema = Joi.object().keys({
    new_username: Joi.string().required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email({tlds: {allow: ["com"]}}).required(),
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required()
  })
  validate_updates = {
    "new_username": req.body.new_username,
    "password": req.body.password,
    "email": req.body.email, 
    "phone": req.body.phone
  }
  const {error, value} = validateUpdateSchema.validate(validate_updates)
  if (error) {
    console.log("Error" + error.details[0].message)
    res.send(error.details[0].message)
  }
  else {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        console.log("Err" + err)
      }
      else {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            console.log("Err" + err)
          }
          else {
            console.log("HASH", hash)
            req.body.password = hash
            updates = {$set: {
              username: req.body.new_username,
              password: req.body.password,
              email: req.body.email, 
              phone: req.body.phone}
            }
            userModel.updateOne(criteria, updates, function(err, data) {
              if (err) {
                console.log("Err" + err)
              }
              else {
                console.log("Data" + data)
                res.send("successful update")
              }
            })
          }
        })
      }
    })
  }
})

app.get('/adminPanel', loginValidator, function (req, res) {
  if (req.session.real_user[0].type == "admin") {
    res.sendFile(__dirname + "/adminPanel.html")
  } else {
    res.redirect("/welcome")
  }
})

app.get('/getCurrentUser', function (req, res) {
  res.send(req.session.real_user)
})
