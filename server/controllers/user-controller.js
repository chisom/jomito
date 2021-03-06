const User = require('../models/user');
const cookieController = require('./cookie-controller');
const bcrypt = require('bcrypt');
const serverConfig = require('../.server-config');


let userController = {};


// create the user on mongoDB
userController.createUser = (req, res) => {
  // console.log(req.body);

  let bodyObj = req.body;

  let newUser = new User();
  newUser.email = bodyObj.email;
  newUser.password = bodyObj.password;
  newUser.name = bodyObj.name;

  newUser.save(function(err){
    if (err) throw err;
  }).then(() => {
    User.findOne({email: newUser.email}, (err,user) => {
      if (err) return res.status(500).send(err);
      if (user) {
        let newToken = new Buffer(serverConfig.sessionSecret + user.email).toString('base64');
        cookieController.setSSIDCookie(req, newToken);
        res.redirect('/dashboard.html');        
      } else {
        res.status(500).send('no user for you');
      }
    })
  });
};

// list all users
userController.getAllUsers = (req, res) => {
  User.find({}, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.json(result); 
  });
};

// listing a specific user by id
userController.getUserById = (req, res) => {
  User.findById(req.params.user_id, (err, result) => {
    if (err) return res.status(500).send(err);
    if (result) {
      return res.json(result); 
    } else {
      return res.status(500).send("user not found");
    }
  });
};

//updating user by id
userController.updateUserById = (req, res) => {
  User.findByIdAndUpdate(req.params.user_id, req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

//deleting user by id
userController.deleteUserById = (req, res) => {
  User.findByIdAndRemove(req.params.user_id, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send('post deleted');
  });
};

//verify user's credentials
userController.verifyUser = (req, res, next) => {
  User.findOne({email: req.body.email}, (err,user) => {
    if (err) return res.status(500).send(err);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        console.log("you're right!");
        let newToken = new Buffer(serverConfig.sessionSecret + user.email).toString('base64');
        cookieController.setSSIDCookie(req, res, newToken);
        res.status(302).redirect('/dashboard.html');
        } else {
        console.log('access denied... redirecting');
        res.redirect('/');        
      }
    } else {
      console.log('user not found');
      return res.status(500).send("user not found");
    }     
  });
;}

module.exports = userController;