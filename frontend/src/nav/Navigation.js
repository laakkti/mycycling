import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  Navbar,
  NavItem,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { LinkContainer } from "react-router-bootstrap";
import { HouseDoor } from "react-bootstrap-icons";

import Homepage from "../routes/Homepage";
import AmResults from "../routes/AmResults";
import ProResults from "../routes/ProResults";
import MyActivities from "../routes/MyActivities";

const Navigation = ({ user, admin, callBack }) => {
  const handleSelect = (e) => {
    console.log(e);
  };

  return (
    <Router>
      <Navbar style={{ background: "#091834" }} variant="light">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <LinkContainer to={"/"} exact>
          <NavItem className="mr-auto">
            <Button variant="success">
              <HouseDoor color="white" size={22} />
            </Button>
          </NavItem>
        </LinkContainer>

        {user && (
          <>
            
            <NavItem className="ml-auto">
              <DropdownButton
                id="dropdown-basic-button"
                variant="warning"
                title="Analytics"
                onSelect={handleSelect}
              >
                <Dropdown.Item href="#/action-1">Year</Dropdown.Item>
                <Dropdown.Item href="#/action-2">12 months</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Range</Dropdown.Item>
              </DropdownButton>
            </NavItem>

            <LinkContainer to={"/MyActivities"} exact>
              <NavItem>
                <Button>Activities</Button>
              </NavItem>
            </LinkContainer>
            {admin && (
            <NavItem className="ml-auto">
              <Button
                variant="info"
                onClick={() => {
                  callBack("updateDb");
                }}
              >
                Update Db
              </Button>
            </NavItem>)}
            <div className="ml-auto" style={{ paddingRight: "15px" }}>
              {"Kirjautunut: " + user}
            </div>
            <LinkContainer to={"/"} exact>
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
            </LinkContainer>
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

      <Switch>
        <Route path="/AmResults">
          <AmResults callBack={callBack} />
        </Route>
        <Route path="/ProResults">
          {user ? (
            <ProResults callBack={callBack} user={user} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/MyActivities">
          {user ? (
            <MyActivities callBack={callBack} user={user} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route path="/">
          <Homepage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
export default Navigation;
