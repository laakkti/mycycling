import axios from "axios";

//************************
require("dotenv").config();
let baseUrl = "/api/data/";
if (process.env.NODE_ENV === "development")
  baseUrl = "http://localhost:5000/api/data/";

console.log(baseUrl);
//************************

const getDataFromMongo = async (config) => {
  const response = await axios.get(baseUrl + "getactivities", config);

  return response.data;
};

//config sisältää tokenin serverille ja alempana _config sisältää tokenin stravaAPIIn
const updateDataToMongo = async (config) => {
 
  //******************************************************** */
  // seuraavat laita .env-tiedostoon vaiko koodia muutenkin BACKille ja admin vain voi käyttää
  //Strava Credentials
  let clientID = "77276";
  let clientSecret = "b90fcaa7490fd8d5d3871f66484ae6cd42921c99";

  // refresh token and call address
  const refreshToken = "78ef4fba73aed65dbc6f10fab1df1779badbf4a1";

  const callRefresh = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;

  // endpoint for read-all activities. temporary token is added in getActivities()
  const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`;

  // Use refresh token to get current access token
  const getToken = async (callRefresh) => {
    
    console.log(callRefresh);
    const response = await axios.post(callRefresh);
    return response.data.access_token;
  };
  
  //setToken(_token);

  //const callBackendStrava = async () => {
    
    const token = await getToken(callRefresh);

    const _config = {
      headers: { token: token, perPage: 200 }, //,fields:["distance","average_speed","average_heartrate"] }
    };
    
    alert("VARMISTA dailogilla varmaan sama kuin delte, että onko varma update")
    const response = await axios.get(baseUrl + "getstravaactivities", _config);
    //console.log(response.data.length);
    console.log(response.data);
  //};

  //********************************************************§ */

  //const response = await axios.get(baseUrl + "getactivities", config);

  return response.data;
};

//*********************************************************** seuraavat ovat vanhaa, mutta voivat toimia user-datan editoinnissa
const getSummaryData = async (p) => {
  //alert(baseUrl + 'results/' + p);
  try {
    return await axios.get(baseUrl + "results/" + p);
  } catch (exception) {
    let error = exception.response;

    if (error !== undefined) {
      let response = {
        code: error.status,
        message: error.data.error,
      };

      return response;
    } else {
      return null;
    }
  }
};

const getMyData = async (user, config) => {
  try {
    return await axios.get(baseUrl, config);
  } catch (exception) {
    let response = {
      code: 503,
      message: exception.message,
    };
    return response;
  }
};

const deleteItem = async (id, config) => {
  try {
    return await axios.delete(baseUrl + id, config);
    //const response = await axios.delete(baseUrl + id, config);
    //return response.data
  } catch (exception) {
    let response = {
      code: 503,
      message: exception.message,
    };
    return response;
  }
};

const updateItem = async (data, config) => {
  try {
    return await axios.put(baseUrl + data._id, data, config);
    //const response = await axios.put(baseUrl + data._id, data, config);
    // return response.data;
  } catch (exception) {
    let response = {
      code: 503,
      message: exception.message,
    };
    return response;
  }
};

const addItem = async (data, config) => {
  try {
    return await axios.post(baseUrl, data, config);
  } catch (exception) {
    let response = {
      code: 503,
      message: exception.message,
    };
    return response;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getDataFromMongo, updateDataToMongo }; //addItem, deleteItem, getMyData, updateItem, getSummaryData }
