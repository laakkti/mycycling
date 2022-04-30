import React, { useState, useEffect } from "react";
import { toDateTime } from "danfojs";
import { Form } from "react-bootstrap";
import Plot from "react-plotly.js";

const YearsGraph = ({ df, _years }) => {
  const [mode, setMode] = useState("bar");
  const [val, setVal] = useState([]);
  const [years, setYears] = useState([]);

  let condition;
  let tmp;

  let _val = [];

  _years.forEach((item) => {
    let sub_df = df.loc({
      columns: ["distance", "start_date"],
    });

    condition = toDateTime(sub_df["start_date"]).year().eq(item);
    sub_df = sub_df.loc({ rows: condition });

    tmp = sub_df["distance"].sum();
    tmp = Math.round(tmp / 1000);
    _val.push(tmp);
  });

  useEffect(() => {
    setYears(_years);
    setVal(_val);
  }, []);

  const modes = ["bar", "line"];
  let data = [{ type: mode, x: years, y: _val }];

  return (
    <div>
      <div id="plot_div" />
      <Plot
        data={data}
        layout={{
          plot_bgcolor: "#133863",
          paper_bgcolor: "#133863",
          xaxis: {
            title: "Year",
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
    </div>
  );
};
export default YearsGraph;
