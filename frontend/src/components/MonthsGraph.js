import React, { useState, useEffect } from "react";
import { DataFrame, toDateTime } from "danfojs";

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

  if (mode === "line") {
    const gDf = new DataFrame({ ride: _val }, { index: months });

    const layout = {
      title: {
        text: "",
        x: 0,
      },

      width: 1000,
      yaxis: {
        title: "km",
        color: "#FFA500",
      },
      xaxis: {
        title: "Month",
        color: "#FFA500",
      },
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",
    };

    const config = {
      columns: ["ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").line({ layout, config });
  } else {
    const gDf = new DataFrame({ ride: _val }, { index: months });

    const layout = {
      width: 1000,
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",

      yaxis: {
        title: "km",
        color: "#FFA500",
      },
      xaxis: {
        title: "Month",
        color: "#FFA500",
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
      <select
        className="float-right mr-1 btn btn-info"        
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
      </select>
    </div>
  );
};

export default MonthsGraph;
