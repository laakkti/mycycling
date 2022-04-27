import React, { useState, useEffect } from "react";
import { DataFrame, toDateTime, Series } from "danfojs";
import DataForm from "../components/DataForm";

import { Button, Container, Row, Col } from "react-bootstrap";

import { Navbar, NavItem } from "react-bootstrap";

import ToastMsg from "../components/ToastMsg";
import YearsGraph from "../components/YearsGraph";
import MonthsGraph from "../components/MonthsGraph";
import MonthsSummaryGraph from "../components/MonthsSummaryGraph";

import Logo from "../img/logo.svg";

const MyActivities = ({ callBack, user }) => {
  const [df, setDf] = useState();
  const [years, setYears] = useState();

  const [mode, setMode] = useState(2); // oletus että kaikki näytetään
  //const [myData, setMyData] = useState([]);
  const [myDataToShow, setMyDataToShow] = useState([]);

  const [showMode, setShowMode] = useState(0); // oletus että kaikki näytetään
//  const [selectedIndex, setSelectedIndex] = useState(0);


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

  const handleForm = async (_mode, id,selectedIndex) => {
    if (_mode === 0) {
      let data = [];
      //setSelectedIndex(selectedIndex); 
      setMyDataToShow([data]);
      setMode(_mode);
    } else if (_mode === 5) {
      // id-muuttujassa tulee myös data vois toki olla 2 eri muuttujaa
      let data = id;

      doQuery(data);
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
        console.log("----------------------------------");
        val[0].distance = val[0].distance / 1000;
        val[0].average_speed = (
          (val[0].distance / val[0].moving_time) *
          3600
        ).toFixed(2);

        result.push(val[0]);
      }
    }

    setMyDataToShow(result);
    setMode(2);
  };

  let header = ["Start", "End", "Topic"];
  if (mode === 2) {
    // nämää pitäis kai saada jostakin luettua, onko josnin kentät minkä nimisiä
    header = [
      "Date",
      "Moving time (s)",
      "Distance (km)",
      "Avg speed (km/h)",
      "Avg hr (bpm)",
    ];
  }
  //{ background: "#091834" }
  return (
    <Container>
      <Navbar style={{ background: "#000000" }} variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <NavItem className="ml-auto">
          <Button
            variant="outline-success"
            onClick={() => {
              setShowMode(1);
            }}
          >
            Years
          </Button>
        </NavItem>
        <NavItem className="ml-2">
          <Button
            variant="outline-warning"
            onClick={() => {
              setShowMode(2);
            }}
          >
            Months
          </Button>
        </NavItem>

        <NavItem className="ml-2">
          <Button
            variant="outline-info"
            onClick={() => {
              setShowMode(4);
            }}
          >
            Summary
          </Button>
        </NavItem>

        <NavItem>
          <Button
            className="ml-2"
            variant="outline-primary"
            onClick={() => {
              handleForm(0, null);
              setShowMode(3);
            }}
          >
            Query
          </Button>
        </NavItem>
      </Navbar>

      <Row>
        <Col>
          <h2> </h2>
        </Col>
      </Row>

      {showMode === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={Logo} width="50%" style={{ marginTop: "50px" }} alt="" />
        </div>
      )}
      {showMode === 1 && <YearsGraph df={df} _years={years} />}
      {showMode === 2 && <MonthsGraph df={df} _years={years} />}
      {showMode === 4 && <MonthsSummaryGraph df={df} _years={years} />}

      {/*{showMode !== 3 && */}

      {showMode === 3 && (
        <DataForm
          mode={mode}
          data={myDataToShow}
          header={header}
          func={handleForm}          
        />
      )}

      <div id="plot_div" style={{ display: "none" }} />
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
