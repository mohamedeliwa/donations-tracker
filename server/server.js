const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// end point for sending the target and current values of the donation
app.get("/data", async (req, res) => {
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(),"db.json"));
    const data = JSON.parse(buffer.toString());
    res.send(data);
  } catch (error) {
    res.status(400).send({error: error.message})
  }
});

// end point for updating the current and target value of donations
app.post("/data", async (req, res) => {
  try {
    const current = req.body.current;
    const target = req.body.target;
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const buffer = fs.readFileSync(path.join(process.cwd(),"db.json"));
    const data = JSON.parse(buffer.toString());
    data.current = current ? current : data.current;
    data.target = target ? target : data.target;
    fs.writeFileSync(path.join(process.cwd(),"db.json"),JSON.stringify(data));
    res.send(data);
  } catch (error) {
    console.log(error.message)
    res.status(400).send({error: error.message})
  }
});

// end-point for authentication and creating then sending an auth jwt
app.post("/auth", async(req, res) => {
  try {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    if (process.env.USERNAME !== username || process.env.PASSWORD !== password) throw new Error("Wrong username or password!");
    const token = jwt.sign({ _id: process.env.USER_ID }, process.env.JWT_SECRET, { expiresIn: '5m' });
    res.send({token});
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})

// end-point for checking the validity of the jwt
app.post("/token", async (req, res) => {
  try {
    const token = req.body.token;
    // console.log(req.body.token)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.send()
  } catch (error) {
    res.status(400).send()
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});