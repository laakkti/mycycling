const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`;

//import axios from 'axios';
const axios = require("axios");

// cors - allow connection from different domains and ports
app.use(cors());

// convert json string to json object (from request)
app.use(express.json());

// mongo here...
const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://AA4598:Rytky2021@clusteraa4598.jpjh8.mongodb.net/todos?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database test connected");
});

// Mongoose Scheema and Model here...
// scheema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const strava = require("strava-v3");

// nämä turhia sillä nyt tehtdään kuten frontillakin axios...
strava.config({
  client_id: "77276",
  client_secret: "b90fcaa7490fd8d5d3871f66484ae6cd42921c99",
  redirect_uri: "https://localhost:3000",
});

/*strava.config({
  //access_token: "0e3b0497386a830165863423db339fb300823a2b",
  client_id: "77276",
  client_secret: "b90fcaa7490fd8d5d3871f66484ae6cd42921c99",
  redirect_uri: "https://localhost:3000",
});*/

/*
//import {Strava}  from "strava";
const Strava = require("strava"); 

const strava = new Strava({
  client_id: '77276',
  client_secret: 'b90fcaa7490fd8d5d3871f66484ae6cd42921c99',
  refresh_token: '0e3b0497386a830165863423db339fb300823a2b',
})*/

async function getActivities(access) {
  let x = await axios.get(callActivities + access);
  console.log(callActivities + access);
  console.log(x);
  /*
    fetch(callActivities + access)
      .then((res) => res.json())       
       .then((data) => console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤¤ "+data.length))
      //.then((data) => setActivities(data), setIsLoading(!isLoading)) //setIsLoading(prev => !prev))
      .catch((e) => console.log(e));
      */
}

const getStrava = async (token) => {
  getActivities(token);
};

const xxxgetStrava = async (token) => {
  try {
    strava.activities.listActivities(
      { access_token: token },
      function (err, payload) {
        if (err === null) {
          res.end(JSON.stringify(payload));
        } else {
          console.log("error getting activities", err);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
  /*
  await strava.athlete.listActivities(access_token: token, 
  (err, payload, limits) => {
    console.log(err);
  }
  );
  */
  /*
  try {
    //await strava.athletes.get({id:741808},function(err,payload,limits) {
    //do something with your payload, track rate limits
    //});

    //await strava.athlete.listActivities(req.params.stravaId, (err, payload, limits) =>{
    await strava.athlete.listActivities(741808, (err, payload, limits) => {});
  } catch (err) {
    console.error(err.message);
  }*/
};
/*
  strava.athletes.get({id:77276},(err,payload,limits) =>{
    console.log("#1 stravaxxxxxxxxxxxxxx "+err);
    console.log("#2 stravaxxxxxxxxxxxxxx "+payload);
    console.log("#3 stravaxxxxxxxxxxxxxx "+limits);
*/

//do something with your payload, track rate limits
//});

//  const payload = await strava.athlete.get({})
//   console.log(payload)
/*
  const payload = await strava.athlete.listFollowers({
    page: 1,
    per_page: 2,
  });
  console.log(payload);
  return true;*/
//});
/*
strava.athletes.get({id:77276},(err,payload,limits) =>{
    console.log("#1 stravaxxxxxxxxxxxxxx "+err);
    console.log("#2 stravaxxxxxxxxxxxxxx "+payload);
    console.log("#3 stravaxxxxxxxxxxxxxx "+limits);
*/

//do something with your payload, track rate limits
//});

//}

app.get("/strava", async (request, response) => {
  //console.log(request);
  const token = request.get("token");
  console.log(token);

  try {
    getStrava(token);
  } catch (err) {
    console.log(err.message);
  }

  /*const config = {
      headers: { Authorization: _token }
    }*/
  //const data = await getStrava();
  //response.json(data);
});

// model
const Todo = mongoose.model("Todo", todoSchema, "todos");

// Routes here...
app.post("/todos", async (request, response) => {
  const { text } = request.body;
  const todo = new Todo({
    text: text,
  });
  const savedTodo = await todo.save();
  response.json(savedTodo);
});

app.get("/todos", async (request, response) => {
  const todos = await Todo.find({});
  response.json(todos);
});

app.get("/todos/:id", async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (todo) response.json(todo);
  else response.status(404).end();
});

app.delete("/todos/:id", async (request, response) => {
  const deletedTodo = await Todo.findByIdAndRemove(request.params.id);
  if (deletedTodo) response.json(deletedTodo);
  else response.status(404).end();
});

app.put("/todos/:id", async (request, response) => {
  const { id } = request.params;
  const { text } = request.body;

  const todo = {
    text: text,
  };

  const updatedTodo = await Todo.findByIdAndUpdate(id, todo, { new: true });

  if (updatedTodo) response.json(updatedTodo);
  else response.status(404).end();
});

// todos-route
app.get("/todos", (request, response) => {
  response.send("Todos");
});

// app listen port 3000
app.listen(port, () => {
  console.log("Example app listening on port 3000");
});
