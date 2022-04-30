import React, { useState, useEffect } from "react";
import { toDateTime } from "danfojs";
import { Form } from "react-bootstrap";
import Plot from "react-plotly.js";

const MonthsGraph = ({ df, _years }) => {
  const [mode, setMode] = useState("bar");
  const [year, setYear] = useState(_years[0]);
  const [val, setVal] = useState([]);
  const [years, setYears] = useState([]);
  const start = 1;
  const end = 12;
  const [months, setMonths] = useState(
    [...Array(end - start + 1).keys()].map((x) => x + start)
  );

  /*useEffect(() => {
    setYear(_years[0]);    
  }, []);*/

  let sub_df = df.loc({
    columns: ["distance", "start_date"],
  });

  let _year = parseInt(year);

  let condition = toDateTime(sub_df["start_date"]).year().eq(_year);

  sub_df = sub_df.loc({ rows: condition });

  let _val = [];

  for (let month = 0; month < 12; month++) {
    condition = toDateTime(sub_df["start_date"]).month().eq(month);
    let sub_dfx = sub_df.loc({ rows: condition });

    let sum = sub_dfx["distance"].sum();

    sum = Math.round(sum / 1000);

    _val.push(sum);
  }

  useEffect(() => {
    setYears(_years);
    //setVal(_val);
  }, []);

  const modes = ["bar", "line"];

  let data = [{ type: mode, x: months, y: _val }];

  return (
    <div>
      <Plot
        data={data}
        layout={{
          plot_bgcolor: "#133863",
          paper_bgcolor: "#133863",
          xaxis: {
            title: "Month",
            showline: true,
            zeroline: false,
            color: "#00FFFF",
          },
          yaxis: {
            title: "Km",
            showline: false,
            zeroline: false,            
            color: "#00FFFF",
          },
          legend: {
            font: { family: "Arial", size: 12, color: "#14a2b8" },
          },

        }}
        config={{ displayModeBar: false }}
        useResizeHandler={true}
        style={{ width: "90%", height: "90%" }}
      />
      
      <Form.Control
        className="float-right mr-5 btn"
        style={{ width: "auto" }}
        as="select"
        id="type"
        custom
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
      </Form.Control>

      <Form.Control
        className="float-right mr-1 btn"
        style={{ width: "auto" }}
        as="select"
        id="type"
        custom
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
      </Form.Control>
    </div>
  );
};

export default MonthsGraph;
