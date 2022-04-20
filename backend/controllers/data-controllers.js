const axios = require("axios");
const Ride = require("../models/data-model");
const checkToken = require("../utils/checkToken");

// pois
//const socketIo = require("socket.io");

const getStravaGPSData = async (request, response) => {
  const token = request.get("token");
  const activity_id = request.get("activity_id");

  //const getStravaGPSData = async (access, activity_id) => {
  //let activity_id="6907345973";
  //const url = `https://www.strava.com/api/v3/activities/${activity_id}/export_gpx?access_token=${token}`;
  const url = `https://www.strava.com/api/v3/activities/${activity_id}/stream?access_token=${token}`;
  console.log(url);

  try {
    let ret = await axios.get(url);
    console.log(ret.data);
  } catch (error) {
    console.error("¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤¤*****************************");
    console.error("error_message: " + error.message);
    console.error("error_status: " + error.status);
    //console.error(ret);
    //console.error("ret_status: "+ret.status);
    //console.error("*****************************");
    if (error.response) {
      console.log(
        "error.response.data: " + JSON.stringify(error.response.data)
      );
      console.log("error.response.status: " + error.response.status);
      console.log(
        "error.response.headers: " + JSON.stringify(error.response.headers)
      );
    }
  }
};

const getStravaData = async (access, perPage) => {
  const url =
    "https://www.strava.com/api/v3/athletes/741808/stats?access_token=" +
    access;

  let total = 0;
  try {
    let ret = await axios.get(url);
    total = ret.data.all_ride_totals.count;
    console.log(total);
  } catch (error) {
    console.error("*****************************");
    console.error("error_message: " + error.message);
    console.error("error_status: " + error.status);
    //console.error(ret);
    //console.error("ret_status: "+ret.status);
    //console.error("*****************************");
    if (error.response) {
      console.log("error.response.data: " + error.response.data);
      console.log("error.response.status: " + error.response.status);
      console.log("error.response.headers: " + error.response.headers);
    }
  }

  const activitiesURL =
    "https://www.strava.com/api/v3/athlete/activities?access_token=";
  //let fields = ["distance", "average_speed", "average_heartrate"];

  let allActivities = [];
  let i = 1;
  //for (let i = 1; i <= pageNbr; i++) {
  let ret = null;
  let ready = false;

  var queryCount = Math.floor(total / perPage);
  if (total % perPage > 0) queryCount++;

  //while (!ready) {
  for (let i = 1; i <= queryCount; i++) {
    try {
      ret = await axios.get(
        activitiesURL + access + "&page=" + i + "&per_page=" + perPage
      );
      activities = ret.data;
      console.log("i= " + i);
    } catch (error) {
      ready = true;
      console.error("*****************************");
      console.error("error_message: " + error.message);

      if (error.response) {
        console.log(
          "error.response.data: " + JSON.stringify(error.response.data)
        );
        console.log("error.response.status: " + error.response.status);
        console.log(
          "error.response.headers: " + JSON.stringify(error.response.headers)
        );
      }
    }

    let result = activities.filter((item) => {
      if (item.average_heartrate === undefined) {
        item.average_heartrate = 0;
      }

      if (item.type !== "Ride") {
        console.log("item.type=" + item.type);
      }

      if (item.type === "Ride") {
        return {
          ride_id: item.id,
          start_date: item.start_date,
          moving_time: item.moving_time,
          distance: item.distance,
          average_speed: item.average_speed,
          average_heartrate: item.average_heartrate,
        };
      }
    });
    allActivities = allActivities.concat(result);
    console.log(allActivities.length);
  }

  // poista ja paluata true onnistumisen vuoksi
  console.log("--------------------------------------");
  console.log(allActivities.length);
  console.log("--------------------------------------");
  
  //********************
  await saveToMongo(allActivities);

  return allActivities.length;
};

const saveToMongo = async (allActivities) => {
  // tee funktio // tämä siis datan lisääminen mongoDb-kantaan
  try {
    await Ride.collection.drop();
  } catch (error) {
    console.error("*****************************");
    console.error("error_message: " + error.message);

    if (error.response) {
      console.log(
        "error.response.data: " + JSON.stringify(error.response.data)
      );
      console.log("error.response.status: " + error.response.status);
      console.log(
        "error.response.headers: " + JSON.stringify(error.response.headers)
      );
    }
  }

  //console.log(allActivities[0]);
  //console.log(allActivities[0].id);

  // ehkei tarvita proeptyjen nimiä vaan kuten user-tapauksessakin arvot riittpp
  for (let i = 0; i < allActivities.length; i++) {
    const ride = new Ride({
      ride_id: allActivities[i].id,
      start_date: allActivities[i].start_date,
      moving_time: allActivities[i].moving_time,
      distance: allActivities[i].distance,
      average_speed: allActivities[i].average_speed,
      average_heartrate: allActivities[i].average_heartrate,
    });

    try {
      await ride.save();
    } catch (error) {
      console.error("*****************************");
      console.error("error_message: " + error.message);

      if (error.response) {
        console.log(
          "error.response.data: " + JSON.stringify(error.response.data)
        );
        console.log("error.response.status: " + error.response.status);
        console.log(
          "error.response.headers: " + JSON.stringify(error.response.headers)
        );
      }
    }
  }
};

const getStravaActivities = async (request, response) => {
  const token = request.get("token");
  const perPage = request.get("perPage");
  //const fields = request.get("fields");
  //console.log(token + "  " + pageCnt + "  " + perPage);

  try {
    //const data = await getStrava(token, pageCnt, perPage);


    const socket=request.app.socket;

    //socket.emit("onProgress", socket.id);
    socket.emit("onProgress", true);

    setTimeout(() => { socket.emit("onProgress", false); }, 10000);
    //const data = await getStravaData(token, perPage); //, fields);
    //response.json(data.length);
    
    response.json(0);
  } catch (err) {
    console.log(err.message);
  }
};

const getActivities = async (request, response, next) => {
  try {
    
    //console.log("getActivitiesxxxx "+app.socket+"xxxxx");
    /*console.log("############ "+request.app.socket);
    for(let item in request){

      console.log(item);
    }*/
    //console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤ "+request.app.get("socket"));
    console.log("¤¤¤¤¤¤¤¤¤¤¤¤¤xxx "+request.app.socket.id);
    //request.app.socket.emit("onProgress", socket.id);
    const socket=request.app.socket;

    //socket.emit("onProgress", socket.id);
    socket.emit("connected", "START");
    

    /*
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const user = value.data;
    */

    //const Ride = mongoose.model("Ride", rideSchema);

    //app.get("/strava/getall", async (request, response) => {
    const data = await Ride.find({});
    response.json(data);
    //});

    //const data = await Data.find({ user: user });
    //response.json(data);
  } catch (exception) {
    console.log("xxxxxx "+exception.message);
    next(exception);
  }
};

//***************************************************************************

const getSummaryData = async (request, response, next) => {
  try {
    const pro = request.path.indexOf("amateur") !== -1;

    // huom lookup "from": "users" eli user pitää olla monikossa koska mongoose tallentaa collectionin monikossa kantaan
    const data = await Data.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "email",
          as: "utype",
        },
      },
      { $match: { "utype.pro": pro } },
      {
        $project: {
          date: {
            $toDate: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: { $toString: "$date" } },
              },
            },
          },
          repeat: "$repeat",
          user: "$user",
        },
      },
      {
        $group: {
          _id: "$date",
          repeat_sum: { $sum: "$repeat" },
          sum: { $addToSet: "$user" },
        },
      },
      {
        $project: {
          date: "$_id",
          repeats: "$repeat_sum",
          users: { $size: "$sum" },
          _id: 0,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    response.json(data);
  } catch (exception) {
    next(exception);
  }
};

const getMyData = async (request, response, next) => {
  try {
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const user = value.data;

    const data = await Data.find({ user: user });
    response.json(data);
  } catch (exception) {
    next(exception);
  }
};

const deleteItem = async (request, response, next) => {
  try {
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    await Data.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
};

const updateItem = async (request, response, next) => {
  try {
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const body = request.body;
    await Data.findByIdAndUpdate(request.params.id, body, { new: true })
      .then((updatedData) => {
        response.json(updatedData);
      })
      .catch((error) => next(error));
  } catch (exception) {
    next(exception);
  }
};

const addItem = async (request, response, next) => {
  try {
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const user = value.data;

    const { date, type, repeat, weight } = request.body;

    const data = new Data({
      user,
      date,
      type,
      repeat,
      weight,
    });

    const savedData = await data.save();

    response.json(savedData);
  } catch (exception) {
    next(exception);
    //response.json("ERROR: " + exception.message);
  }
};

/*
exports.getSummaryData = getSummaryData;
exports.getMyData = getMyData;
exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.updateItem = updateItem;
*/
exports.getStravaActivities = getStravaActivities;
exports.getActivities = getActivities;
exports.getStravaGPSData = getStravaGPSData;
