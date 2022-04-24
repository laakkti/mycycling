import React, { useState} from "react";
import { DataFrame, toDateTime} from "danfojs";

const MonthsGraph = ({ df, years}) => {
  
    
  const [mode, setMode] = useState("bar");
  const [year, setYear] = useState(years[0]);
  
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
      
      
      width: 1000,
      yaxis: {
        title: "km",
      },
      xaxis: {
        title: "Month",
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
    //*********************************************
  } else {
    const start = 1;
    const end = 12;
    const months = [...Array(end - start + 1).keys()].map((x) => x + start);
    const gDf = new DataFrame({ ride: val }, { index: months });

    const layout = {
      width: 1000,
      plot_bgcolor: "#133863",
      paper_bgcolor: "#133863",
      
      
      yaxis: {
        title: "km",
        color:"#00FF00"
      },
      xaxis: {
        title: "Month",
        color:"#00FFFF"        
      },
      
    };

    const config = {
      displayModeBar: false,
      displaylogo: false,      
    };

    gDf.plot("plot_div").bar({ layout, config});
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
      <select
        style={{ background: "darkcyan" }}
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
