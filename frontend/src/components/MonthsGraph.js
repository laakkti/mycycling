import React, { useState,useEffect } from "react";
import { DataFrame, toDateTime, Series } from "danfojs";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const MonthsGraph = ({ df, years}) => {
  
    
  const [mode, setMode] = useState("bar");
  const [year, setYear] = useState(years[0]);
  //const [df, setDf] = useState(_df);

  /*
  useEffect(() => {
    
    setDf(df);
  }, []);
*/
  
  let sub_df = df.loc({
    columns: ["distance", "start_date"],
  });
  
  let _year=parseInt(year);  
  let condition = toDateTime(sub_df["start_date"]).year().eq(_year);
  
  sub_df = sub_df.loc({ rows: condition });

  
 


  let val = [];


  for (let month = 0; month < 12; month++) {
    condition = toDateTime(sub_df["start_date"]).month().eq(month);
    let sub_dfx = sub_df.loc({ rows: condition });
    //console.log(sub_dfx);
    let sum = sub_dfx["distance"].sum();
    sum = Math.round(sum / 1000);
    
    val.push(sum);
  }

  //*********************************************
  if (mode === "line") {
    const start = 1;
    const end = 12;
    const months = [...Array(end - start + 1).keys()].map((x) => x + start);
    const gDf = new DataFrame({ ride: val }, { index: months });

    const layout = {
      title: {
        text: "",
        x: 0,
      },
      legend: {
        bgcolor: "#fcba03",
        bordercolor: "#444",
        borderwidth: 1,
        font: { family: "Arial", size: 10, color: "#fff" },
      },
      width: 1000,
      yaxis: {
        title: "km",
      },
      xaxis: {
        title: "Month",
      },
    };

    const config = {
      columns: ["ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").line({ layout, config });
    //*********************************************
  } else {
    const start = 1;
    const end = 12;
    const months = [...Array(end - start + 1).keys()].map((x) => x + start);
    const gDf = new DataFrame({ ride: val }, { index: months });

    const layout = {
      width: 1000,
      plot_bgcolor: "#00BBAA",
      paper_bgcolor: "#00BB55",
      yaxis: {
        title: "km",
      },
      xaxis: {
        title: "Month",
      },
    };

    const config = {
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").bar({ layout, config });
  }
  const modes = ["bar", "line"];

  return (
    <div>
      
      <Form.Select
        style={{ background: "cyan" }}
        value={mode}
        onChange={({ target }) => {
          setMode(target.value);
        }}
      >
        {modes.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </Form.Select>
      <Form.Select
        style={{ background: "cyan" }}
        value={year}
        onChange={({ target }) => {
          setYear(target.value);
        }}
      >
        {years.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
};

export default MonthsGraph;
