import React, { useState, useEffect, useCallback } from "react";
import { DataFrame, toDateTime, Series } from "danfojs";
import DataForm from "../components/DataForm";
import { Button, Container, Row, Col } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";

import ToastMsg from "../components/ToastMsg";

const MyActivities = ({ callBack, user }) => {
  const [df, setDf] = useState();
  const [years, setYears] = useState();

  // tämä malli henkilötietojen muokkaamiseen!!!
  const [mode, setMode] = useState(2); // oletus että kaikki nöytetään
  const [myData, setMyData] = useState([]);
  const [myDataToShow, setMyDataToShow] = useState([]);

  const [showToast, setShowToast] = useState(false);

  const [message, setMessage] = useState({
    header: "",
    message: "",
    autohide: false,
    delay: 0,
    style: {
      backgroundcolor: "#00FF00",
      color: "blue",
    },
  });

  //***************************************************************

  useEffect(() => {
    const getData = async () => {
      const data = await callBack("getActivitiesData");
      const df = new DataFrame(data);
      console.log(df);
      setYears(await getYears(df));
      setDf(df);
    };
    getData();
  }, [callBack]);

  const getYears = async (df) => {
    let sub_df = df.loc({
      columns: ["start_date"],
    });
    sub_df["start_date"] = toDateTime(sub_df["start_date"]).year();

    sub_df = sub_df.loc({ columns: ["start_date"] });
    let sf = new Series(sub_df["start_date"].values);
    return sf.unique().values;
  };

  const showAll = async (p) => {
    /*let sub_df = df.loc({
      columns: ["distance", "average_speed", "start_date"],
    });*/

    //let years = await getYears(df);

    let condition;
    let xxx;

    let val = [];

    years.forEach((item) => {
      let sub_df = df.loc({
        columns: ["distance", "start_date"],
      });

      condition = toDateTime(sub_df["start_date"]).year().eq(item);
      sub_df = sub_df.loc({ rows: condition });

      xxx = sub_df["distance"].sum();
      xxx = Math.round(xxx / 1000);
      val.push(xxx);
      console.log(item);
      console.log(xxx);
    });

    // tee funktio

    const gDf = new DataFrame({ ride: val }, { index: years });

    const layout = {
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

    const config = {
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").bar({ layout, config });
  };

  //columns ei tarvoita kuin yksi haluttu, VOIS OLALA column parametrina sekä bar tai line
  const showAll2 = async (p) => {
    //let years = await getYears(df);

    let condition;
    let xxx;

    let val = [];
    years.forEach((item) => {
      let sub_df = df.loc({
        columns: ["distance", "start_date"],
      });

      condition = toDateTime(sub_df["start_date"]).year().eq(item);
      sub_df = sub_df.loc({ rows: condition });
      xxx = sub_df["distance"].sum();
      xxx = Math.round(xxx / 1000);
      val.push(xxx);
    });

    // tee funktio

    const gDf = new DataFrame({ ride: val }, { index: years });

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
        title: "Year",
      },
    };

    const config = {
      columns: ["ride"], //columns to plot
      displayModeBar: false,
      displaylogo: false,
    };

    gDf.plot("plot_div").line({ layout, config });
  };

  const getMonthChart = (year, mode) => {
    let sub_df = df.loc({
      columns: ["distance", "start_date"],
    });

    console.log("****************************************");
    console.log(sub_df["start_date"]);
    console.log(toDateTime(sub_df["start_date"]));
    console.log("****************************************");

    let km = [];

    let condition = toDateTime(sub_df["start_date"]).year().eq(year);
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
    //*************************************************** */
  };

  const getAll = () => {};

  //***************************************************************
  /*const getAll = useCallback(async () => {

    const data = await callBack("getMyData");

    setMyData(data);
    setMyDataToShow(data);
    setMode(2);


  }, [callBack]);*/

  const showTheToast = (header, message, delay, backgroundcolor, color) => {
    setMessage({
      header: header,
      message: message,
      autohide: true,
      delay: delay,
      closeParent: false,
      style: {
        backgroundcolor: backgroundcolor,
        color: color,
      },
    });

    setShowToast(true);
  };

  const handleForm = async (_mode, id) => {
    console.log("############ mode= " + mode);

    if (_mode === 0) {
      let data = [];
      data[0] = {
        id: null,
        date: new Date(),
        type: "Hauis",
        repeat: 0,
        weight: 0,
      };

      setMyDataToShow([data]);
      setMode(_mode);
    } else if (_mode === 1) {
      await callBack("deleteItem", id);
      showTheToast(
        "Poistaminen",
        "Tiedon poistaminen onnistui",
        3000,
        "#79BEA8",
        "#000000"
      );
      getAll();
      //setMode(2);
    } else if (_mode === 3) {
      let data = myData.find((item) => {
        return item._id === id;
      });

      setMyDataToShow([data]);
      setMode(_mode);
    } else if (_mode === 2) {
      // editointimodessa cancel

      setMyDataToShow(myData);
      setMode(_mode);
    } else if (_mode === 5) {
      // id-muuttujassa tulee myös data vois toki olla 2 eri muuttujaa
      let data = id;
      //      alert(data.date.toISOString());

      doQuery(data);
    } else if (_mode === 5555) {
      let data = id;

      try {
        const response = await callBack("addItem", data);

        if (response.code === 503) {
          showTheToast(
            "Virhetilanne",
            response.message,
            3000,
            "#FF9999",
            "#000000"
          );
        } else {
          showTheToast(
            "Lisääminen",
            "Tiedon lisääminen onnistui",
            3000,
            "#79BEA8",
            "#000000"
          );
          getAll();
        }
      } catch (exception) {
        showTheToast(
          "Virhetilanne",
          exception.message,
          3000,
          "#FF9999",
          "#000000"
        );
      }
    } else if (_mode === 6) {
      let data = id;

      // virhetarkastwlu try-catch puuttuuu LISÄÄ
      await callBack("updateItem", data);

      showTheToast(
        "Päivitys",
        "Tiedon päivittäminen onnistui",
        3000,
        "#79BEA8",
        "#000000"
      );

      getAll();
      //setMode(2);
    }
  };

  const action = () => {
    //getAll();
  };

  const doQuery = async (data) => {
    let startDate = data.startDate;
    let endDate = data.endDate;

    startDate = new Date(startDate.setUTCHours(0, 0, 0, 0));
    endDate = new Date(endDate.setUTCHours(23, 59, 0, 0));

    startDate = startDate.toISOString();
    endDate = endDate.toISOString();

    let sub_df = df.loc({
      columns: [
        "ride_id",
        "start_date",
        "moving_time",
        "distance",
        "average_speed",
        "average_heartrate",
      ],
    });

    let result = [];
    for (let i = 0; i < sub_df.index.length; i++) {
      let date = sub_df.at(i, "start_date");

      if (date >= startDate && date <= endDate) {
        console.log(date);
        let val = sub_df.iloc({ rows: [i] }).toJSON();
        result.push(val[0]);
      }
    }

    setMyDataToShow(result);
    setMode(2);
  };

  let header = ["Start", "End", "Topic"];
  if (mode === 2) {
    // nämää pitäis kai saada jostakin luettua, onko josnin kentät minkä nimisiä
    header = ["Date", "Duration", "Distance", "Avg speed", "Avg hr"];
  }

  return (
    <Container>
      <Button
        onClick={() => {
          getMonthChart(2021, "line");
        }}
      >
        Month line
      </Button>

      <Button
        onClick={() => {
          getMonthChart(2021, "bar");
        }}
      >
        Month bar
      </Button>
      <Button
        onClick={() => {
          showAll();
        }}
      >
        Show bar
      </Button>
      <Button
        onClick={() => {
          showAll2();
        }}
      >
        Show linechart
      </Button>
      <div id="plot_div"></div>
      <Row>
        <Col>
          <h2>Omat suoritukset</h2>
        </Col>
        {/*{mode === 2 && (*/}
        <Col>
          <Button
            className="float-right mt-1 btn btn-primary btn-sm>"
            onClick={() => {
              handleForm(0, null);
            }}
          >
            <PlusCircleFill width="20" height="20"></PlusCircleFill>
          </Button>
        </Col>
        {/*})}*/}
      </Row>

      <DataForm
        mode={mode}
        data={myDataToShow}
        header={header}
        func={handleForm}
      />

      <ToastMsg
        show={showToast}
        close={() => {
          setShowToast(false);
          action();
        }}
        params={message}
      ></ToastMsg>
    </Container>
  );
};

export default MyActivities;
