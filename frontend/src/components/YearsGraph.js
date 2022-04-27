import React, { useState, useEffect } from "react";
import { DataFrame, toDateTime } from "danfojs";

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

  // _val, _years

  const gDf = new DataFrame({ ride: val }, { index: years });
  let layout;
  let config;

  if (mode === "bar") {
    layout = {
      width: 1000,
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",
      yaxis: {
        title: "km",
        color: "#00FF00",
      },
      xaxis: {
        title: "Year",
        color: "#00FF00",
      },
    };

    config = {
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").bar({ layout, config });
  } else {
    layout = {
      title: {
        text: "",
        x: 0,
      },
      width: 1000,
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",

      

      yaxis: {
        title: "km",
        color: "#00FF00",
      },
      xaxis: {
        title: "Year",
        color: "#00FF00",
      },
    };

    config = {
      columns: ["ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").line({ layout, config });
  }

  const modes = ["bar", "line"];

  return (
    <div>
      <div id="plot_div" />
      <select
        className="float-right mr-5 btn btn-success"
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
      </select>
    </div>
  );
};
export default YearsGraph;
