import axios from "axios";

require("dotenv").config();
let baseUrl = "/api/data/";
if (process.env.NODE_ENV === "development")
  baseUrl = "http://localhost:5000/api/data/";

const getDataFromMongo = async (config) => {
  const response = await axios.get(baseUrl + "getactivities", config);

  return response.data;
};

const updateDataToMongo = async (config) => {
  const response = await axios.get(baseUrl + "getstravaactivities", config);
  // palauttaa datan pituuden

  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getDataFromMongo, updateDataToMongo };
