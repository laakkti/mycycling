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


// kokeile täällä kirjoitaa mongoon
const getActivities= async (access, pageNbr, perPage)=> {

  let allActivities = [];
  for (let i = 1; i <= pageNbr; i++) {
    let ret = await axios.get(
      callActivities + access + "&page=" + i + "&per_page=" + perPage
    );
    activities = ret.data;

    // vois olla oma funktionsa
    let result = activities.map((item) => {
      return {
        distance: item.distance,
        average_speed: item.average_speed,
        average_heartrate: item.average_heartrate,
      };
    });

    allActivities = allActivities.concat(result);
  }

  return allActivities;
}

/*
const getStrava = async (token, pageCnt, perPage) => {
  return await getActivities(token, pageCnt, perPage);
};*/


app.get("/strava", async (request, response) => {
  //console.log(request);
  const token = request.get("token");
  const pageCnt = request.get("pageCnt");
  const perPage = request.get("perPage");
  console.log(token + "  " + pageCnt + "  " + perPage);

  try {
    //const data = await getStrava(token, pageCnt, perPage);
    const data = await getActivities(token, pageCnt, perPage);
    response.json(data);
  } catch (err) {
    console.log(err.message);
  }

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
