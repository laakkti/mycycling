import React, { useState, useEffect } from "react";
import Row from "./Row";
import { Table, Form } from "react-bootstrap";
import "./css/form.css";

const DataForm = ({ mode, data, header, func }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thisFunc = (mode, data, selectedIndex) => {
    func(mode, data);
    setSelectedIndex(selectedIndex);
  };

  const HeaderRow = ({ header }) => {
    return (
      <tbody>
        <tr>
          {header.map((item, ind) => {
            return (
              <td key={ind} style={{ background: "#091834", color: "#79abff" }}>
                {item}
              </td>
            );
          })}
        </tr>
      </tbody>
    );
  };

  return (
    <Form
      className="overflow-auto form"
      style={{
        maxHeight: "587px",
      }}
      autoComplete="off"
    >
      <Table className="table table-sm table-primary" responsive="sm">
        {data.length > 0 && <HeaderRow header={header} />}
        {data.length > 0 &&
          data.map((item) => {
            return (
              <Row
                key={item.ride_id}
                mode={mode}
                item={item}
                func={thisFunc}
                _selectedIndex={selectedIndex}
              />
            );
          })}
      </Table>
    </Form>
  );
};
export default DataForm;
