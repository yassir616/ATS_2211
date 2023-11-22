import "./acceuil.css";

import { Avatar, Card, Col, Row } from "antd";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from "recharts";

import img1 from "../../assets/adminstartioncon.webp";
import img2 from "../../assets/paramicon.webp";
import img3 from "../../assets/productionIcon.webp";
import img4 from "../../assets/participantsIcon.webp";

const { Meta } = Card;

//chartLine config
const colors = scaleOrdinal(schemeCategory10).range();

const dataLine = [
  {
    name: "Produit A",
    uv: 4000,
    female: 2400,
    male: 2400
  },
  {
    name: "Produit B",
    uv: 3000,
    female: 1398,
    male: 2210
  },
  {
    name: "Produit C",
    uv: 2000,
    female: 9800,
    male: 2290
  }
];

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y +
  height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y +
  height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = props => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
};

//chart2 config
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class Acceuil extends PureComponent {
  render() {
    return (
      <div>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              type="inner"
              align="center"
              title="Répartition du chiffre d'affaires par produit"
              bordered={true}
            >
              <PieChart width={500} height={300}>
                <Pie
                  data={data}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              type="inner"
              title="Production Par produit"
              align="center"
              bordered={true}
            >
              <BarChart
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
                width={500}
                height={300}
                data={dataLine}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar
                  dataKey="female"
                  fill="#8884d8"
                  shape={<TriangleBar />}
                  label={{ position: "top" }}
                >
                  {dataLine.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                  ))}
                </Bar>
              </BarChart>
            </Card>
          </Col>
        </Row>
        <br />
        <Row gutter={23}>
          <Col span={6}>
            <Link to="/users">
              <Card
                hoverable
                style={{ borderTop: "3px solid rgb(236 154 52)" }}
                cover={<img src={img1} alt="users" />}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      A
                    </Avatar>
                  }
                  title="Administration"
                  description="Gestion des utilisateurs"
                  style={{ width: 226, height: 93 }}
                />
              </Card>
            </Link>
          </Col>
          <Col span={6}>
            <Link to="/consultproduitdeces">
              <Card
                hoverable
                style={{ borderTop: "3px solid rgb(138 155 247)" }}
                cover={<img src={img2} alt="consultproduitdeces" />}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      G
                    </Avatar>
                  }
                  title="Paramétrage"
                  description="Gestion des produits"
                  style={{ width: 226, height: 93 }}
                />
              </Card>
            </Link>
          </Col>
          <Col span={6}>
            <Link to="/souscription">
              <Card
                hoverable
                style={{ borderTop: "3px solid rgb(146 206 222)" }}
                cover={<img src={img3} alt="souscription" />}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      S
                    </Avatar>
                  }
                  title="Production"
                  description="Nouvelle souscription"
                  style={{ width: 226, height: 93 }}
                />
              </Card>
            </Link>
          </Col>
          <Col span={6}>
            <Link to="/AllParticipant">
              <Card
                hoverable
                style={{ borderTop: "3px solid rgb(255 59 59)" }}
                cover={<img src={img4} alt="AllParticipant" />}
              >
                <Meta
                  avatar={
                    <Avatar
                      style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                    >
                      P
                    </Avatar>
                  }
                  title="Participants"
                  description="Gestion des clients"
                  style={{ width: 226, height: 93 }}
                />
              </Card>
            </Link>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

export default Acceuil;
