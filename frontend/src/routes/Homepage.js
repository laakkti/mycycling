import React from "react";
import Logo from "../img/logo.svg";

import { useNavigate } from "react-router-dom";

const Homepage = () => {
  let navigate = useNavigate();

  const onClick = (event) => {
    console.log("navigate")
    navigate("/MyActivities");
  };

  return (
    <div>
      <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
        <div style={{ color: "white", fontSize: "30px" }}>
          Pyöräilyaktiviteettien data-analytiikka
        </div>

        <h6 style={{ color: "#609CE1" }}>2022 ©AA4598</h6>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={Logo} width="40%" style={{ marginTop: "50px" }} alt=""></img>
      </div>
      <button onClick={(e) => onClick(e)}>Kirjaudu</button>
    </div>
  );
};
export default Homepage;
