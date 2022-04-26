import React from "react";
import Logo from "../img/logo.svg";

const Homepage = () => {

  return (
    <div>
      <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
        <div style={{ color: "white", fontSize: "30px" }}>
          Pyöräilyaktiviteettien data-analytiikka
        </div>

        <h6 style={{ color: "#609CE1",marginTop: "8px"}}>2022 ©AA4598</h6>
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
      
    </div>
  );
};
export default Homepage;
