import React from "react";
import Logo from "../img/logo.svg";

const Homepage = () => {

  //voisiko toimia näin ???df.plot("plot_div").line({ layout, config, {responsive: true} })
  //layout={{ width: 1024, height: 768, title: "A Fancy Plot" }}
  return (
    <div>
      <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
        <div style={{ color: "white", fontSize: "30px" }}>
          Pyöräilyaktiviteettien data-analytiikka
        </div>
        <h6 style={{ color: "#609CE1", marginTop: "8px" }}>2022 ©AA4598</h6>
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
