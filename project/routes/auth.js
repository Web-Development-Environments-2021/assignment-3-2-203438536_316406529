var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {//assign user to system
  try {
    // parameters exists
    // valid parameters
    // username exists
    if (req.session.username) {
      //some user is login
      throw {
        status: 409,
        message: "You are already login. logout in order to register",
      };
    }
    const users = await DButils.execQuery("SELECT username FROM dbo.Users");

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.Users (username, firstname, lastname, country, password, email, picture) VALUES ('${req.body.username}', '${req.body.firstname}','${req.body.lastname}','${req.body.country}','${hash_password}','${req.body.email}','${req.body.picture}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {//log in to system for gest only
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    try {
      if (req.session.username) {
        res.status(401).send("User already loged-in");
        return;
      }
    } catch {}
    req.session.username = user.username;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

router.post("/user/logOut", function (req, res) {//log out from system- loged in users only
  if (req.session.username) {
    req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
    res.status(200).send({ success: true, message: "logout succeeded" });
  } else {
    res.status(400).send({ success: false, message: "No user to logout." });
  }
});

module.exports = router;
