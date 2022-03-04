const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`;
//"https://www.strava.com/api/v3/routes/{id}" "Authorization: Bearer [[token]]"

//import axios from 'axios';
const axios = require("axios");

// cors - allow connection from different domains and ports
app.use(cors());

// convert json string to json object (from request)
app.use(express.json());

// mongo here...
const mongoose = require("mongoose");
const mongoDB =
  "mongodb+srv://AA4598:Rytky2021@clusteraa4598.jpjh8.mongodb.net/cyclingdb?retryWrites=true&w=majority";
//"mongodb+srv://AA4598:Rytky2021@clusteraa4598.jpjh8.mongodb.net/todos?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database test connected");
});

const rideSchema = new mongoose.Schema({
  ride_id: { type: String, required: true },
  start_date: { type: Date, required: true },
  moving_time: { type: Number, required: true },
  distance: { type: Number, required: true },
  average_speed: { type: Number, required: true },
  average_heartrate: { type: Number, required: true },
});

const Ride = mongoose.model("Ride", rideSchema); //, "Cyclings");

// Mongoose Scheema and Model here...
// scheema
/*const cyclingSchema = new mongoose.Schema({
  text: { type: String, required: true },
});*/

/*
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});*/

// kokeile täällä kirjoitaa mongoon,
//#### parametrikis halutut kentät vai voisiko jo mongoon tehdä filtteri EI OLE MONGOSSA VAAN Stravassa
// https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
// db.inventory.find( { status: "A" }, { item: 1, status: 1 } )

// poista fields vastuu backendille jos muutoksia tarvitaan
const getActivities = async (access, pageNbr, perPage) => {
  let fields = ["distance", "average_speed", "average_heartrate"];

  let allActivities = [];
  let i = 1;
  //for (let i = 1; i <= pageNbr; i++) {
  let ret = null;
  let error = false;
  while (!error) {
    try {
      ret = await axios.get(
        callActivities + access + "&page=" + i + "&per_page=" + perPage
      );
      activities = ret.data;
      i++;
    } catch (error) {
      console.error("*****************************");
      console.error("error_message: " + error.message);
      console.error("error_status: " + error.status);
      //console.error(ret);
      //console.error("ret_status: "+ret.status);
      //console.error("*****************************");
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      error = true;
    }
    // vois olla oma funktionsa

    // "type" : "Ride", pitää huomioida

    let result = activities.map((item) => {
      /*      let fields = ["distance", "average_speed", "average_heartrate"];
      let str = "";
      for (let i = 0; i < fields.length; i++) {
        str += fields[i] + ":" + item[fields[i]] + ",";
      }*/

      //console.log(str);

      /*let model = {
        distance: item["distance"],
        average_speed: item["average_speed"],
        average_heartrate: item["average_heartrate"],
      };*/

      //var myObj = {[fields[0]]:item[fields[0]] };

      if (item.average_heartrate === undefined) {
        item.average_heartrate = 0;
      }

      //console.log("item.id="+item.id)

      return {
        ride_id: item.id,
        start_date: item.start_date,
        moving_time: item.moving_time,
        distance: item.distance,
        average_speed: item.average_speed,
        average_heartrate: item.average_heartrate,
        //var myObj = {[fields[0]]:item[fields[0]] };
      };
    });

    allActivities = allActivities.concat(result);
  }

  //*** lisätty kokeeksi 15.2.2022
  // model

  // tee funktio
  for (let i = 0; i < allActivities.length; i++) {
    const ride = new Ride({
      ride_id: allActivities[i].ride_id,
      start_date: allActivities[i].start_date,
      moving_time: allActivities[i].moving_time,
      distance: allActivities[i].distance,
      average_speed: allActivities[i].average_speed,
      average_heartrate: allActivities[i].average_heartrate,
    });

    //const saved = await ride.save();
  }

  // poista ja paluata true onnistumisen vuoksi
  console.log("--------------------------------------");
  console.log(allActivities.length);
  console.log("--------------------------------------");
  return allActivities.length;
};

/*
const getStrava = async (token, pageCnt, perPage) => {
  return await getActivities(token, pageCnt, perPage);
};*/

// olisko .post paremminkin
app.get("/strava", async (request, response) => {
  //console.log(request);
  const token = request.get("token");
  const pageCnt = request.get("pageCnt");
  const perPage = request.get("perPage");
  //const fields = request.get("fields");
  console.log(token + "  " + pageCnt + "  " + perPage);

  try {
    //const data = await getStrava(token, pageCnt, perPage);
    const data = await getActivities(token, pageCnt, perPage); //, fields);
    response.json(data);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/strava/getall", async (request, response) => {
  const datas = await Ride.find({});
  response.json(datas);
});

/*
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
*/

// app listen port 3000
app.listen(port, () => {
  console.log("Example app listening on port 3000");
});
