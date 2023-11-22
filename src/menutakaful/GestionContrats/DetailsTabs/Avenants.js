import "antd/dist/antd.css";
import { Collapse, Table } from "antd";
import React, { Component } from "react";
import { getAvenant } from "../../Parametrage/avenant/AvenantAPI.js";
import { MyContext } from "../ConsultDecesContrat";

const { Panel } = Collapse;

var id = "";
class Avenants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left",
      data: []
    };
    this.columns = [
      {
        title: "Numéro d'avenant",
        dataIndex: "numeroAvenant",
        key: "numeroAvenant"
      },
      {
        title: "Date d'effet",
        dataIndex: "dateEffet",
        key: "dateEffet"
      },
      {
        title: "Type d'avenant",
        dataIndex: "typeAvenant.libelle",
        key: "typeAvenant"
      }
    ];
  }

  componentDidMount() {
    this.getAvenants(id);
  }

  getAvenants = idContrat => {
    getAvenant(idContrat).then(response => {
      let newDataList = [];
      response.data.forEach(element => {
        let key = { key: element.id };
        element = { ...element, ...key };
        newDataList.push(element);
      });
      this.setState({ data: newDataList });
    });
  };

  render() {
    const { expandIconPosition } = this.state;
    return (
      <MyContext.Consumer>
        {context => (
          (id = context.state.id),
          (
            <React.Fragment>
              <div>
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIconPosition={expandIconPosition}
                >
                  <Panel header="Liste des Avenants" key="1">
                    <div>
                      <Table
                        rowClassName="editable-row"
                        columns={this.columns}
                        dataSource={this.state.data}
                        pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
                      />
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </React.Fragment>
          )
        )}
      </MyContext.Consumer>
    );
  }
}
export default Avenants;
