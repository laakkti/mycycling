import React, { useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import userService from './services/user-service';
import dataService from './services/data-service';

import Navigation from './nav/Navigation';
import LoginDialog from './components/LoginDialog';

const App = () => {
  
  // turha koska dataFrame sisältää jatkossa sourcen
  //const [activities, setActivities] = useState({});
  const [stravaToken, setStravaToken] = useState({});
  const [mongoData, setMongoData] = useState();


  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");
  // toisaalta kun on tokenperusteinen toiminta niin jos token niin  ollaa inessä
  const [login, setLogin] = useState(false);


  // seuraava data-serviceen!!!!
  // tähän ehto onko dev vai... ON SERVICESSA
  //const baseUrl = "http://localhost:5000/api/data/";

  const getConfig = () => {

    let _token = `bearer ${token}`
    const config = {
      headers: { Authorization: _token }
    }

    return config;
  }

  const updateDataToMongo = async () => {  

     let ret= await dataService.updateDataToMongo(getConfig());
  }


  
// ehkä kuitenkin suoritetaan kirjautumisen yhteydessä eli ei haeta turhaan dataa jos...
  useEffect(async () => {

    
    // vai muutetaanko vain getData -- koska muita lähteitä ei ole
    let mongoData= await dataService.getDataFromMongo(getConfig());
    //let data = await getDataFromMongo();

    console.log("***********************");
    console.log(mongoData.length);
    console.log("***********************");

    setMongoData(mongoData);

    /*
    let allActivities =[];
    for (let i = 1; i < 11; i++) {
      const activities = await getActivities(_token, i);
      allActivities=allActivities.concat(activities);
    }
    console.log("=============================== "+allActivities.length);
 */
  }, []);


  const handleRegister = async (user) => {
    const data = await userService.register(user);

    return data;
  }


  const handleLogin = async (id, data, func) => {

    if (id === 1) {

      if (data !== null) {

        const response = await userService.login(data);


        if (response !== null) {
          if (response.code === 200) {

            // oliskos vain data tieto tallessa ja siitä data.email data.token
            setUser(response.data.email);
            setUserName(response.data.firstname);
            setToken(response.data.token);
          }
          return response;
        } else {

          return null;
        }

      }
    } else if (id === 2) {

      return await handleRegister(data);
    }

  }

  
  const getMyData = async (user) => {

    return await dataService.getMyData(user, getConfig());

  }

  const addItem = async (data) => {

    //alert(await dataService.addItem(data, getConfig()));
    return await dataService.addItem(data, getConfig());
  }


  const deleteItem = async (id) => {

    return await dataService.deleteItem(id, getConfig());

  }

  const updateItem = async (id) => {

    return await dataService.updateItem(id, getConfig());

  }



  const callBack = async (topic, data) => {

  
    if (topic === 'getActivitiesData') {
      //alert("xxxxxxxxxxxxxx "+df.length)    
      return mongoData;

    }else if (topic === 'updateDb') {
      
      await updateDataToMongo();
        
    }else if (topic === 'getSummaryData') {

      const response = await dataService.getSummaryData(data);
      return response.data;

    } else if (topic === 'login') {


      setLogin(true);

    } else if (topic === 'logout') {

      setUserName('');

    } else if (topic === 'addItem') {

      //data.user = user;

      let response = await addItem(data);

      return response;

    } else if (topic === 'deleteItem') {

      let response = await deleteItem(data)
      return response;

    } else if (topic === 'updateItem') {

      return await updateItem(data)

    } else if (topic === 'getMyData') {

      const response = await getMyData(user);
      return response.data;
    }

  }

  // mieti Logindialogin muuttujien nimet uudelleen ja piirrä kuva toiminnasta
  // setLogin on useSatete muuttujan funktio eli säsältäpäin voidaan asettaa näkyvyys

  // container fluid tsekkaa eri routejen asetukset container vai container fluid vai ei mitään
  return (
    <Container fluid style={{ background:'#353b45'}}>
      <div>
        <LoginDialog _show={login} showDialog={setLogin} func={handleLogin}></LoginDialog>
      </div>

      <Navigation user={userName} callBack={callBack} />
    </Container>
  )
}

export default App;