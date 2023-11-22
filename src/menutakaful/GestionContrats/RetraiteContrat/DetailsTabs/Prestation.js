import "antd/dist/antd.css";
import { Table } from "antd";
import React from "react";
import { getPrestationRachatTotal } from "../../../Parametrage/TypePrestation/PrestationAPI";

import { MyContext } from "../ConsultRetraiteContrat/ConsultRetraiteContrat";
let id = "";
class Prestation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: "",
      expandIconPosition: "left"
    };

    this.columns = [
      {
        title: "Date de la création",
        dataIndex: "creationDate",
        key: "creationDate"
      },
      {
        title: "Date de depart",
        dataIndex: "dateDepart",
        key: "dateDepart"
      },
      {
        title: "Montant Brut de Rachat Total",
        dataIndex: "montantBrutRachatTotal",
        key: "montantBrutRachatTotal"
      },
      {
        title: "Montant Net de Rachat Total",
        dataIndex: "montantNetRachatTotal",
        key: "montantNetRachatTotal"
      }
    ];
  }

  componentDidMount() {
    this.updateData(id);
  }

  async updateData(id) {
    const result = await getPrestationRachatTotal(id).then(data => data);
    this.setState({
      data: result.data
    });
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => (
          (id = context.state.id),
          (
            <React.Fragment>
              <div>
                <Table
                  columns={this.columns}
                  dataSource={this.state.data}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5
                  }}
                ></Table>
              </div>
            </React.Fragment>
          )
        )}
      </MyContext.Consumer>
    );
  }
}
Prestation.contextType = MyContext;
export default Prestation;
