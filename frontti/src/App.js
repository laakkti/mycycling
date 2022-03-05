import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import "./App.css";
import axios from "axios";
import { DataFrame, toDateTime, Series } from "danfojs";

function App() {
  const [activities, setActivities] = useState({});
  const [token, setToken] = useState({});

  const [df, setDf] = useState();

  const baseUrl = "http://localhost:3000/";

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
    const _config = {
      headers: { token: token }, //,fields:["distance","average_speed","average_heartrate"] }
    };
    const response = await axios.get(baseUrl + "strava/getall", _config);
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

    return activities.length;
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
      headers: { token: token, pageCnt: 10, perPage: 1000 }, //,fields:["distance","average_speed","average_heartrate"] }
    };

    const response = await axios.get(baseUrl + "strava", config);
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

  const getAll = async (p) => {
    let sub_df = df.loc({
      columns: ["distance", "average_speed", "start_date"],
    });

    let years = await getYears(sub_df);

    //console.log("********************************");
    //console.log(years); //.count());
    //console.log("******************************** "+years[0]);

    //console.log(sub_df['distance']);
    //sub_df["start_date"] = toDateTime(sub_df["start_date"]).year();
    //console.log(sub_df['start_date']);
    //sub_df = sub_df.loc({ columns: ["start_date"] });

    let condition;
    let xxx;

    // pitää getYear funktiossa käyttää muita muutuja tyypepjä ettei tarvii uudelleen määritää dataframa

    //years.values.forEach((item) => {
    
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
      //{ ride: [20, 18, 489, 675, 1776]},
      { ride: val},
      { index: years }
      //{ index: [1990, 1997, 2003, 2009, 2014] }
    );

    //console.log("********************************")
    //console.log(item)
    //console.log(sub_df["start_date"]);

    //condition = toDateTime(sub_df["start_date"]).year().eq(item);
    //sub_df = sub_df.loc({ rows: condition });

    // huom vain joulukuu eli index =11
    /*
      condition = toDateTime(sub_df["start_date"]).month().eq(11);
      sub_df = sub_df.loc({ rows: condition });
      let xxx = sub_df["distance"].sum();
      console.log(xxx);
      */
    //sub_df.print();
    //});

    /*
    console.log(years.values);
    console.log(years.getColumnData());
    console.log(years.data);*/
    //console.log(years[0].);

    /*for(let i=0;i<years.count();i++){

       console.log(years(i)); 
       //.values());
    }*/

    /*    for(let item in years.data){

        console.log(item.values);
    }*/

    /*
    condition = toDateTime(sub_df["start_date"]).year().eq(2021);
    sub_df = sub_df.loc({ rows: condition });
    //console.log(sub_df)

    condition = toDateTime(sub_df["start_date"]).month().eq(11);
    sub_df = sub_df.loc({ rows: condition });
    //console.log(sub_df)
    sub_df.print();
    let xxx = sub_df["distance"].sum();

    let arr = [4, 25, 281, 600, 1900];
    let result = new DataFrame({ ride: arr }, { index: [1, 2, 3, 4, 5] });

    console.log(xxx);
    */

    /* HUOM */
    /* vois groupata Vuoden mukaan sekä kuukauden ja siten käyttää sum*/
    // tsekkaa harjoitustyöä python/panda

    /*
    condition = sub_df["distance"].lt(5000); //   .and(df["distance"].lt(20))
    sub_df = sub_df.loc({ rows: condition })
    console.log(sub_df)
*/

    //sub_df['distancexxx']=sub_df['distance'].values+999
    /*let condition = sub_df["distance"].lt(5000); //   .and(df["distance"].lt(20))
    sub_df = sub_df.loc({ rows: condition })
    console.log(sub_df);*/
    //console.log(toDateTime(sub_df['start_date']).dayOfMonth())
    //console.log(sub_df);

    //console.log(sub_df['start_date'].data[0]);
    //console.log(sub_df.start_date);
    //console.log(sub_df.start_date());
    /// tästä oma funktio

    
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
      //columns: ["gDf.ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false
    }

    gDf.plot("plot_div").bar({ layout, config });

    //df.plot("plot_div").bar({ layout, _config });
    //sub_df.plot("plot_div").bar({ layout, _config });
  };

  return (
    <div className="App">
      {showActivities()}
      <button onClick={callBackendStrava} id="button">
        Strava API
      </button>
      <button onClick={() => getAll("year")} id="xxx">
        Year
      </button>
      <div id="plot_div"></div>
    </div>
  );
}

export default App;
