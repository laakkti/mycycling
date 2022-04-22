import React, { useState, useEffect } from "react";
import { Container,Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import socketIOClient from "socket.io-client";

import { useNavigate }  from "react-router-dom";
// pois*******************
//import { useHistory} from "react-router-dom";
//import { Redirect } from 'react-router-dom';
//************************

import userService from "./services/user-service";
import dataService from "./services/data-service";

import Navigation from "./nav/Navigation";
import LoginDialog from "./components/LoginDialog";
import ConfirmModal from "./components/ConfirmModal";
import OnProgressModal from "./components/OnProgressModal";



import "./App.css";

const App = () => {
  // turha koska dataFrame sisältää jatkossa sourcen
  //const [activities, setActivities] = useState({});
  //const [stravaToken, setStravaToken] = useState({});
  const [mongoData, setMongoData] = useState();

  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState("");
  // toisaalta kun on tokenperusteinen toiminta niin jos token niin  ollaa inessä
  const [login, setLogin] = useState(false);
  const [progressShow, setProgressShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  //const [confirm, setConfirm] = useState(false);

  //const history = useHistory();
  let navigate = useNavigate();
  // seuraava data-serviceen!!!!
  // tähän ehto onko dev vai... ON SERVICESSA
  //const baseUrl = "http://localhost:5000/api/data/";

  const getConfig = () => {
    let _token = `bearer ${token}`;
    const config = {
      headers: { Authorization: _token },
    };

    return config;
  };

  const updateDataToMongo = async () => {
    await dataService.updateDataToMongo(getConfig());
  };

  // ehkä kuitenkin suoritetaan kirjautumisen yhteydessä eli ei haeta turhaan dataa jos...

  useEffect(() => {
    // vai muutetaanko vain getData -- koska muita lähteitä ei ole

    let baseUrl = "/";
    if (process.env.NODE_ENV === "development")
      baseUrl = "http://localhost:5000";

    //       baseUrl ="/";
    //const socket = socketIOClient("http://localhost:5000");
    const socket = socketIOClient(baseUrl);

    socket.on("onProgress", (p) => {
      console.log("message from bacend onProgress "+p);
      setProgressShow(p);
    });

    socket.on("connect", (data) => {
      console.log("socket connected");
    });

    socket.on("connected", (data) => {
      console.log("message from bacend connectedxxx " + data);
    });

    // tämä lienee parempi suorittaa vasta kirjautumisen jälkeen silloin voisi []-sulkeiden sisälle laittaa jonkun useStaten esim. user!!!!!
    const getData = async () => {
      let mongoData = await dataService.getDataFromMongo(getConfig());
      //let data = await getDataFromMongo();

      console.log("***********************");
      console.log(mongoData.length);
      console.log("***********************");

      setMongoData(mongoData);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // tänne kaikki cleaning-jutut
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRegister = async (user) => {

    const data = await userService.register(user);

    return data;
  };

  const handleLogin = async (id, data, func) => {
    if (id === 1) {
      if (data !== null) {
        const response = await userService.login(data);

        if (response !== null) {
          if (response.code === 200) {
            // oliskos vain data tieto tallessa ja siitä data.email data.token
            
            setUser(response.data.email);
            setUserName(response.data.firstname);
            setAdmin(response.data.admin);
            setToken(response.data.token);
            navigate("/MyActivities");
            
            //let history = useHistory();
            //history.push("/home")
          }
          return response;
        } else {
          return null;
        }
      }
    } else if (id === 2) {
      return await handleRegister(data);
    }
  };

  const getMyData = async (user) => {
    return await dataService.getMyData(user, getConfig());
  };

  const addItem = async (data) => {
    //alert(await dataService.addItem(data, getConfig()));
    return await dataService.addItem(data, getConfig());
  };

  const deleteItem = async (id) => {
    return await dataService.deleteItem(id, getConfig());
  };

  const updateItem = async (id) => {
    return await dataService.updateItem(id, getConfig());
  };

  const callBack = async (topic, data) => {
    if (topic === "getActivitiesData") {
      //alert("xxxxxxxxxxxxxx "+df.length)
      return mongoData;
    } else if (topic === "updateDb") {
            
      updateDb();
    } else if (topic === "getSummaryData") {
      const response = await dataService.getSummaryData(data);
      return response.data;
    } else if (topic === "login") {
      setLogin(true);
    } else if (topic === "logout") {
      setUserName("");
    } else if (topic === "addItem") {
      //data.user = user;

      let response = await addItem(data);

      return response;
    } else if (topic === "deleteItem") {
      let response = await deleteItem(data);
      return response;
    } else if (topic === "updateItem") {
      return await updateItem(data);
    } else if (topic === "getMyData") {
      const response = await getMyData(user);
      return response.data;
    }
  };

  const updateDb=()=> {
    setConfirmShow(true);
  }


  const updateDatabase = async (p) => {
    if (p === true) {
      // muuta tämän muuttujan nimeä
      
      await updateDataToMongo();
      //setConfirm(false);
    }
  };

  

  // mieti Logindialogin muuttujien nimet uudelleen ja piirrä kuva toiminnasta
  // setLogin on useSatete muuttujan funktio eli säsältäpäin voidaan asettaa näkyvyys

  // container fluid tsekkaa eri routejen asetukset container vai container fluid vai ei mitään
  const style = { backgroundColor: "#353b45" };

  const redirect=()=>{

    
      //history.push("/");
    //return <Redirect to='/MyActivities'/>
    //let navigate = useNavigate();
    //navigate("/MyActivities");
    //alert("HEippa");
    /*
  useEffect(() => {
    if (user) {
      let history = useHistory();
      history.push("/MyActivities");
    }
  }, [user]);
  */


  
  }

  return (
    <Container fluid className="App">
      <div style={style}>
  
        <LoginDialog
          _show={login}
          showDialog={setLogin}
          func={handleLogin}
        ></LoginDialog>

        {/*<ConfirmModal show={confirmShow} onHide={() => setConfirmShow(false)} />*/}
        <ConfirmModal
          show={confirmShow}
          onHide={() => setConfirmShow(false)}
          updateDb={updateDatabase}
        />
        <OnProgressModal show={progressShow} message={"Loading..."} />
      </div>

      <Navigation user={userName} admin={admin} callBack={callBack} />
    </Container>
  );
};

export default App;
