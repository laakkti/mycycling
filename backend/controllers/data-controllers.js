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

  //await saveToMongo(allActivities);

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

  // ehkei tarvita proeptyjen nimiä vaan kuten user-tapauksessakin arvot riittää
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
      //   console.log("item "+i+" saved to mongodb");
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
  console.log("save to mongodb ready");
  return true;
};

const getStravaActivities = async (request, response) => {
  const value = checkToken.checkToken(request);
  if (!value.status || !value.admin) {
    return value.data;
  }

  // seuraavat laita .env-tiedostoon
  //Strava Credentials
  let clientID = "77276";
  let clientSecret = "b90fcaa7490fd8d5d3871f66484ae6cd42921c99";

  // refresh token and call address
  const refreshToken = "78ef4fba73aed65dbc6f10fab1df1779badbf4a1";

  const callRefresh = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;

  // Use refresh token to get current access token
  const getToken = async (callRefresh) => {
    console.log(callRefresh);
    const response = await axios.post(callRefresh);
    return response.data.access_token;
  };

  const token = await getToken(callRefresh);
  const perPage = 200;

  try {
    const socket = request.app.socket;

    socket.emit("onProgress", true);

    // testi viive socketia varten
    let test = true;
    if (test === true) {
      setTimeout(() => {
        socket.emit("onProgress", false);
      }, 5000);
      response.json(0);
    } else {
      const data = await getStravaData(token, perPage);
      socket.emit("onProgress", false);
      response.json(data.length);
    }
  } catch (exception) {
    console.log("getStravaActivities: " + exception.message);
  }
};

const getActivities = async (request, response, next) => {
  try {
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
