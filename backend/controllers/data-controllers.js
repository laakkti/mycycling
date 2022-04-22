const axios = require("axios");
const Ride = require("../models/data-model");
const checkToken = require("../utils/checkToken");

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
    console.error("error_message: " + error.message);
    console.error("error_status: " + error.status);

    if (error.response) {
      console.log("error.response.data: " + error.response.data);
      console.log("error.response.status: " + error.response.status);
      console.log("error.response.headers: " + error.response.headers);
    }
  }

  const activitiesURL =
    "https://www.strava.com/api/v3/athlete/activities?access_token=";

  let allActivities = [];
  let i = 1;

  let ret = null;
  let ready = false;

  var queryCount = Math.floor(total / perPage);
  if (total % perPage > 0) queryCount++;

  for (let i = 1; i <= queryCount; i++) {
    try {
      ret = await axios.get(
        activitiesURL + access + "&page=" + i + "&per_page=" + perPage
      );
      activities = ret.data;
      console.log("i= " + i);
    } catch (error) {
      ready = true;

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

  await saveToMongo(allActivities);

  return allActivities.length;
};

const saveToMongo = async (allActivities) => {
  try {
    await Ride.collection.drop();
  } catch (error) {
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

  try {
    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const socket = request.app.socket;

    socket.emit("onProgress", true);

    // testi viive soeketia varten
    //setTimeout(() => { socket.emit("onProgress", false); }, 10000);
    const data = await getStravaData(token, perPage);
    response.json(data.length);

    response.json(0);
  } catch (exception) {
    console.log(exception.message);
  }
};

const getActivities = async (request, response, next) => {
  try {
    const socket = request.app.socket;

    const value = checkToken.checkToken(request);
    if (!value.status) {
      return value.data;
    }

    const data = await Ride.find({});
    response.json(data);
  } catch (exception) {
    console.log(exception.message);
    next(exception);
  }
};

exports.getStravaActivities = getStravaActivities;
exports.getActivities = getActivities;
