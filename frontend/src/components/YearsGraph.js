import React, { useState } from "react";
import { DataFrame, toDateTime } from "danfojs";

const YearsGraph = ({ df, years }) => {
  const [mode, setMode] = useState("bar");
  let condition;
  let tmp;

  let val = [];

  years.forEach((item) => {
    let sub_df = df.loc({
      columns: ["distance", "start_date"],
    });

    condition = toDateTime(sub_df["start_date"]).year().eq(item);
    sub_df = sub_df.loc({ rows: condition });

    tmp = sub_df["distance"].sum();
    tmp = Math.round(tmp / 1000);
    val.push(tmp);
  });

  const gDf = new DataFrame({ ride: val }, { index: years });
  let layout;
  let config;

  if (mode === "bar") {
    layout = {
      width: 1000,
      plot_bgcolor: "#00BBAA",
      paper_bgcolor: "#00BB55",
      yaxis: {
        title: "km",
      },
      xaxis: {
        title: "Year",
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
        title: "Year",
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
      <select
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
      </select>
    </div>
  );
};
export default YearsGraph;
