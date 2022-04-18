import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import "./App.css";
import axios from "axios";
import { DataFrame, toDateTime, Series } from "danfojs";

function App() {
  
  //const [activities, setActivities] = useState({});
  const [token, setToken] = useState({});

  const [df, setDf] = useState();

  const baseUrl = "http://localhost:5000/api/data/";
  //const baseUrl = "http://localhost:3000/";

  
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
    console.log("heippa2");
    console.log(callRefresh);
    const response = await axios.post(callRefresh);
    return response.data.access_token;
  };

  const getActivities = async (access, index) => {
    console.log(callActivities + access);
    //let index = 1;
    let perPage = 100;

    const response = await axios.get(
      callActivities + access + "&page=" + index + "&per_page=" + perPage
    );

    let activities = response.data;

    let result = activities.map((item) => {
      return {
        distance: item.distance,
        average_speed: item.average_speed,
        average_heartrate: item.average_heartrate,
      };
    });

    //setActivities(result);
    console.log(result);
    //setIsLoading(!isLoading);
    return activities;
  };

  const getDataFromMongo = async () => {
    
    // lienee turha 
    const _config = {
      headers: { token: token }, //,fields:["distance","average_speed","average_heartrate"] }
    };
    //
    const response = await axios.get(baseUrl + "getactivities", _config);
    //const response = await axios.get(baseUrl + "strava/getall", _config);
    /*console.log(response.data.length);
    
    let pvm = response.data[0].start_date;
    console.log(pvm);
    let date = new Date(pvm);
    console.log(date.getFullYear());
    */
    return response.data;
  };

  useEffect(async () => {
    const _token = await getToken(callRefresh);
    setToken(_token);

    let data = await getDataFromMongo();

    console.log("***********************");
    console.log(data.length);
    console.log("***********************");

    setDf(new DataFrame(data));

    /*
    let allActivities =[];
    for (let i = 1; i < 11; i++) {
      const activities = await getActivities(_token, i);
      allActivities=allActivities.concat(activities);
    }
    console.log("=============================== "+allActivities.length);
 */
  }, []);

  function showActivities() {
    //if (isLoading) return <>LOADING</>;
    //if (!isLoading) {

//    return activities.length;
    //}
  }

  /*
  const strava = async () => {
    const res = await getToken(callRefresh);
    console.log(res.data.access_token);
  };
*/

  // täytyisi selvittää montako page kokonaan sehöän tietty saada kaikki/100 (siis 100 per page)
  // nuo parametri pageCnt perPage ovat turhia!!!!!
  const callBackendStrava = async () => {
    const config = {
      headers: { token: token, perPage: 200 }, //,fields:["distance","average_speed","average_heartrate"] }
    };

    const response = await axios.get(baseUrl + "getStravaActivities", config);
    console.log(response.data.length);
    console.log(response.data);
  };


  const callBackendGPSStrava = async () => {
    const config = {
      headers: { token: token,
      activity_id:"6907345973"
      }
    };

    const response = await axios.get(baseUrl + "getstravagpsdatata", config);
    console.log(response.data.length);
    console.log(response.data);
  };



  const getYears = async (sub_df) => {

    sub_df["start_date"] = toDateTime(sub_df["start_date"]).year();

    sub_df = sub_df.loc({ columns: ["start_date"] });
    let sf = new Series(sub_df["start_date"].values);
    //console.log("&&&&&&&&&&&&&&&&&&&&& GET YEARS");

    //console.log(sf.unique());

    /*
    let sf;
    try{

    sub_df["start_date"] = toDateTime(sub_df["start_date"]).year();    
    console.log(sub_df["start_date"].values);
//    sf = new Series(sub_df["start_date"].values);
//    console.log("&&&&&&&&&&&&&&&&&&&&&"); 
    }catch(e) {
      
    console.log(e.message);
    }*/
    return sf.unique().values;
  };

  
 const getAll2 = async (p) => {
  let sub_df = df.loc({
    columns: ["distance", "average_speed", "start_date"],
  });

  let years = await getYears(sub_df);
  
  let condition;
  let xxx;

  
  let val=[];
  years.forEach((item) => {
    sub_df = df.loc({
      columns: ["distance", "average_speed", "start_date"],
    });

    condition = toDateTime(sub_df["start_date"]).year().eq(item);
    sub_df = sub_df.loc({ rows: condition });
    console.log(sub_df);
    xxx = sub_df["distance"].sum();
    xxx=Math.round(xxx/1000);
    val.push(xxx);
    console.log(item);
    console.log(xxx);
  });


  // tee funktio

  const gDf = new DataFrame(

    { ride: val},
    { index: years },    

  );

  console.log("***********************");
  console.log(gDf);


  const layout = {
    title: {
      text: "",
      x: 0
    },
    legend: {
      bgcolor: "#fcba03",
      bordercolor: "#444",
      borderwidth: 1,
      font: { family: "Arial", size: 10, color: "#fff" }
    },
    width: 1000,
    yaxis: {
      title: "km",
    },
    xaxis: {
      title: "Year",
    },
  }

  const config = {
    columns: ["ride"], //columns to plot
    displayModeBar: false,
    displaylogo: false,
  }

console.log("call plot");

  gDf.plot("plot_div").line({ layout, config })


  
};



  const getAll = async (p) => {
    let sub_df = df.loc({
      columns: ["distance", "average_speed", "start_date"],
    });

    let years = await getYears(sub_df);
    
    let condition;
    let xxx;

    
    let val=[];
    years.forEach((item) => {
      sub_df = df.loc({
        columns: ["distance", "average_speed", "start_date"],
      });

      condition = toDateTime(sub_df["start_date"]).year().eq(item);
      sub_df = sub_df.loc({ rows: condition });
      console.log(sub_df);
      xxx = sub_df["distance"].sum();
      xxx=Math.round(xxx/1000);
      val.push(xxx);
      console.log(item);
      console.log(xxx);
    });


    // tee funktio

    const gDf = new DataFrame(
      { ride: val},
      { index: years }
    );

    const layout = {
      width: 1000,
      plot_bgcolor: "#00BBAA",
      paper_bgcolor: "#00BB55",
      yaxis: {
        title: "km",
      },
      xaxis: {
        title: "Year",
      },
    };
    
    const config = {
      displayModeBar: false,
      displaylogo: false
    }

    gDf.plot("plot_div").bar({ layout, config });

    
  };

  return (
    <div className="App">
      {showActivities()}
      <button onClick={callBackendStrava} id="button">
        Strava API
      </button>
      <button onClick={callBackendGPSStrava} id="button">
        Strava API GPS
      </button>
      
      <button onClick={() => getAll("year")} id="xxx">
        Year Bar
      </button>

      <button onClick={() => getAll2("year")} id="xxx">
        Year Line
      </button>
      <div id="plot_div"></div>
    </div>
  );
}

export default App;
