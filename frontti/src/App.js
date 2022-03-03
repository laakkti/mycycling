import React, { useState, useEffect } from "react";
//import logo from './logo.svg';
import "./App.css";
import axios from "axios";
import { DataFrame,toDateTime,Series } from "danfojs";

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

  useEffect(async () => {
    const _token = await getToken(callRefresh);
    setToken(_token);

    setDf(
      new DataFrame(
        { walk: [20, 18, 489, 675, 1776], 
        ride: [4, 25, 281, 600, 1900] },
        { index: [1990, 1997, 2003, 2009, 2014] }
      )
    );

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
  const callBackendStrava = async () => {
    const config = {
      headers: { token: token, pageCnt: 10, perPage: 100 }, //,fields:["distance","average_speed","average_heartrate"] }
    };

    const response = await axios.get(baseUrl + "strava", config);
    console.log(response.data.length);
    console.log(response.data);
  };

  const getAll = async () => {

    // piäisi olla kirjautmistoken
    const config = {
      headers: { token: token }, //,fields:["distance","average_speed","average_heartrate"] }
    };

    const response = await axios.get(baseUrl + "strava/getall", config);
    console.log(response.data.length);
    //console.log(response.data);
    let pvm = response.data[0].start_date;
    console.log(pvm);
    let date = new Date(pvm);
    console.log(date.getFullYear());


    setDf(
      new DataFrame(
        response.data.slice(0,3)        
      )
    );

// huom df påitää määritää setDf-metodilla

let dataf=new DataFrame(
        response.data //.slice(0,3)        
      )

    //let dfx=dataf; //.iloc({rows: [0,1,2]})
    //console.log(dfx);
    
    let sub_df = dataf.loc({columns: ["distance", "average_speed","start_date"]})
    //console.log(sub_df)
    //console.log(sub_df['distance'])

    /*sub_df.loc({ rows: df["start_date"]})

    sub_df=sub_df.iloc({rows: [0]});
    sub_df=sub_df['start_date'];
    console.log(sub_df.values[0])*/
    /*
    console.log("*********************************");
    console.log(sub_df["distance"]);
    console.log("*********************************");
         */
    //let ds=toDateTime(sub_df['start_date'])

    //sub_df=sub_df.loc(toDateTime(sub_df['start_date']).dayOfMonth()>14)
    
    try{
    //let condition=toDateTime(sub_df["start_date"]).year(); //.unique();
    sub_df["start_date"] = toDateTime(sub_df["start_date"]).year()
/*let new_col = [1, 2, 3, 4]
df.addColumn("D", new_col, { inplace: true });

df.print()
*/

    }catch(e){
      console.log("error= "+e.message)
    }
    
     
    sub_df=sub_df.loc({columns: ["start_date"]}); 

   console.log(sub_df.values);
    console.log("********************************")
    //console.log(sub_df['start_date'].unique());
    //sub_df.unique().print();
    //sub_df.print();

       //let sf = new dataf.Series(sub_df["start_date"])
       //let sf = new dataf.Series(sub_df)

       let data1 = [1, 2, 3, 4, 5, 6, 7, 8, 1, 1, 22, 8, 5, 5, 5]
//let sf = new Series(data1)
let sf = new Series(sub_df.values)
console.log(sf.unique());
sf.unique().print()
       //sf.unique().print()

    console.log("********************************")

    
    
    let condition=toDateTime(sub_df["start_date"]).year().eq(2021);
    sub_df = sub_df.loc({ rows: condition })
    //console.log(sub_df)

    condition=toDateTime(sub_df["start_date"]).month().eq(11);
    sub_df = sub_df.loc({ rows: condition })
    //console.log(sub_df)
    sub_df.print();
    let xxx= sub_df["distance"].sum();

    let arr=[4, 25, 281, 600, 1900];
    let result=  new DataFrame(
        
        {ride: arr },
        { index: [1,2,3,4,5] }
      )



    console.log(xxx)


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
        title: "1000 km",
      },
      xaxis: {
        title: "Year",
      },
    };

    const _config = {};

    result.plot("plot_div").bar({ layout, _config });

    //df.plot("plot_div").bar({ layout, _config });
    //sub_df.plot("plot_div").bar({ layout, _config });
  };

  return (
    <div className="App">
      {showActivities()}
      <button onClick={callBackendStrava} id="button">
        Strava API
      </button>
      <button onClick={getAll} id="xxx">
        Mongo getAll
      </button>
      <div id="plot_div"></div>
    </div>
  );
}

export default App;
