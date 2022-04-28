import React from "react";
import { Route, Navigate, Link, Routes, useLocation } from "react-router-dom";
import { Navbar, NavItem, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { HouseDoor } from "react-bootstrap-icons";

import Homepage from "../routes/Homepage";
import MyActivities from "../routes/MyActivities";

const Navigation = ({ user, admin, callBack }) => {
  let location = useLocation();

  let path = location.pathname;

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
            {(path === "/") && (
              <Link to="/MyActivities" className="ml-auto">
                <NavItem>
                  <Button variant="outline-warning">Activities</Button>
                </NavItem>
              </Link>
            )}

            {(admin && (path === "/")) && (
              <NavItem className="ml-auto">
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    callBack("updateDb");
                  }}
                >
                  Update Db
                </Button>
              </NavItem>
            )}

            <div
              className="ml-auto"
              style={{ paddingRight: "15px", color: "darkcyan" }}
            >
              {"Logged in: " + user}
            </div>
            <Link to={"/"}>
              <NavItem>
                <Button
                  variant="dark"
                  onClick={() => {
                    callBack("logout");
                  }}
                >
                  Log out
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
              Log in
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
