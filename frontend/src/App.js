import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import socketIOClient from "socket.io-client";

import { useNavigate } from "react-router-dom";

import userService from "./services/user-service";
import dataService from "./services/data-service";

import Navigation from "./nav/Navigation";
import LoginDialog from "./components/LoginDialog";
import ConfirmModal from "./components/ConfirmModal";
import OnProgressModal from "./components/OnProgressModal";

import "./App.css";

const App = () => {
  const [mongoData, setMongoData] = useState();
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [token, setToken] = useState("");

  const [login, setLogin] = useState(false);
  const [progressShow, setProgressShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  //const [loadingStatus, setLoadingStatus] = useState("");
  

  let navigate = useNavigate();

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

  useEffect(() => {
    let baseUrl = "/";
    if (process.env.NODE_ENV === "development")
      baseUrl = "http://localhost:5000";

    const socket = socketIOClient(baseUrl);

    socket.on("onProgress", (p) => {
      console.log("message from backend onProgress " + p);
      //setLoadingStatus(p);
      //alert(p);
      setProgressShow(p);
    });

    socket.on("connect", (data) => {
      console.log("socket connected");
    });

    socket.on("connected", (p) => {
      console.log("message from backend connected" + p);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // tänne kaikki cleaning-jutut
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      let mongoData = await dataService.getDataFromMongo(getConfig());

      setMongoData(mongoData);
      try {
        navigate("/MyActivities");
      } catch (exception) {
        alert(exception.message);
      }
    };

    if (user !== "") {
      getData();
    }
  }, [token]);

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
            setUser(response.data.email);
            setUserName(response.data.firstname);
            setAdmin(response.data.admin);
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
  };

  const callBack = async (topic, data) => {
    if (topic === "getActivitiesData") {
      return mongoData;
    } else if (topic === "updateDb") {
      updateDb();
    } else if (topic === "login") {
      setLogin(true);
    } else if (topic === "logout") {
      setUserName("");
    }
  };

  const updateDb = () => {
    setConfirmShow(true);
  };

  const updateDatabase = async (p) => {
    if (p === true) {
      await updateDataToMongo();
    }
  };

  const style = { backgroundColor: "#353b45" };

  return (
    <Container fluid className="App">
      <div style={style}>        
        <LoginDialog
          _show={login}
          showDialog={setLogin}
          func={handleLogin}
        ></LoginDialog>

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
