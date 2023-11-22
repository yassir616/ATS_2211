/* eslint-disable react/prop-types */
import { Divider, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const ComponentTitle = props => {
  return (
    <div>
      {" "}
      <Title
        level={props.level || 3}
        style={{
          fontFamily:
            "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
          color: "rgba(0, 0, 0, 0.57)",
          fontSize: "22px",
          fontWeight: "normal"
        }}
      >
        {props.title}
      </Title>
      <Divider style={{ marginBottom: "30px", marginTop: "10px" }}></Divider>
    </div>
  );
};
export default ComponentTitle;
