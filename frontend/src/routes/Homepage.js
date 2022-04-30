import React from "react";
import Logo from "../img/logo.svg";

import Plot from "react-plotly.js";

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

      <div>
        <Plot
          data={[

            { type: "bar", x: [1, 2, 3,4,5,6], y: [2, 5, 3,6,2,1] },
          ]}

          layout={{ 
            plot_bgcolor: "#133863",
            paper_bgcolor: "#133863",
            xaxis: {
              showline: true,             
              tickcolor: '#00FFFF',
              color: '#00FFFF'
            },
            yaxis: {
              showline: true,
              tickcolor: '#00FF00',
              color: '#00FF00'
            }
          
          }}
          useResizeHandler={true}
          style={{width: '80%', height: '80%'}}
        />
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
