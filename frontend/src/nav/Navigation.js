//import React from "react";
import React, { useState, useEffect } from "react";
import {  
  Route,  
  Navigate,
  Link,
  Routes,
  useLocation
} from "react-router-dom";
import {
  Navbar,
  NavItem,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { HouseDoor } from "react-bootstrap-icons";

import Homepage from "../routes/Homepage";
import MyActivities from "../routes/MyActivities";

const Navigation = ({ user, admin, callBack }) => {
  const handleSelect = (e) => {
    console.log(e);
  };

  let location = useLocation();

    // useLocation Hook:n avulla päästään käsiksi location-olioon
    console.log("HOME l:", location.pathname);
    
    let path=location.pathname;

    if(path==="/"){
      
    }else{


    }
    

  return (
    <>
      <Navbar style={{ background: "#091834" }} variant="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Link to="/" className="mr-auto">
          <NavItem>
            <Button variant="success">
              <HouseDoor color="white" size={22} />
            </Button>
          </NavItem>
        </Link>
        {user && (
          <>
          
          {(path==="/") && (
            <Link to="/MyActivities" className="ml-auto">
              <NavItem>
                <Button variant="outline-warning">Activities</Button>
              </NavItem>
            </Link>
          )}

            {admin && (
              <NavItem className="ml-auto">
                <Button
                  variant="outline-info"
                  onClick={() => {
                    callBack("updateDb");
                  }}
                >
                  Update Db
                </Button>
              </NavItem>
            )}
        
            <div className="ml-auto" style={{ paddingRight: "15px",color: "darkmagenta" }}>
              {"Kirjautunut: " + user}
            </div>
            <Link to={"/"} >
              <NavItem>
                <Button
                  variant="dark"
                  onClick={() => {
                    callBack("logout");
                  }}
                >
                  Kirjaudu ulos
                </Button>
              </NavItem>
            </Link>
            </>
            )}
            
            {!user && (
              <NavItem className="ml-auto">
                <Button
                  variant="info"
                  onClick={() => {
                    callBack("login");
                  }}
                >
                  Kirjaudu
                </Button>
              </NavItem>
            )}
          
        
      </Navbar>

      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route
          path="/MyActivities"
          element={
            user ? (
              <MyActivities callBack={callBack} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};
export default Navigation;
