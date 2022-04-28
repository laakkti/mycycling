import React, { useState, useEffect } from "react";
import { DataFrame, toDateTime } from "danfojs";

const MonthsSummaryGraph = ({ df, _years }) => {
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

  let summary=[];
  let items={}; 

  //for (let i = 0; i < _years.length; i++) {
  for (let i = 0; i < _years.length; i++) {
    let sub_df = df.loc({
      columns: ["distance", "start_date"],
    });
     

    let _year = parseInt(_years[i]);

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
    //summary.push(_val);
    items[_years[i]]=_val;
  }

  useEffect(() => {
    setYears(_years);
    //setVal(_val);
  }, []);


  if (mode === "line") {
    //const gDf = new DataFrame({ ride: _val }, { index: months });
    const gDf = new DataFrame(items, { index: months });

    const layout = {
      title: {
        text: "",
        x: 0,
      },
      legend: {
        bgcolor: "133863",        
        font: { family: "Arial", size: 12,color: "#14a2b8"},
      },
      width: 1000,
      yaxis: {
        title: "km",
        color: "#14a2b8",
      },
      xaxis: {
        title: "Month",
        color: "#14a2b8",
      },
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",
    };

    const config = {
      //columns: ["ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").line({ layout, config });
  } else {
    //const gDf = new DataFrame({ ride: _val }, { index: months });
    const gDf = new DataFrame(items, { index: months });

    const layout = {
      width: 1000,
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",

      legend: {
        bgcolor: "133863",        
        font: { family: "Arial", size: 12, color: "#14a2b8" },
      },

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
     
    </div>
  );
};

export default MonthsSummaryGraph;
