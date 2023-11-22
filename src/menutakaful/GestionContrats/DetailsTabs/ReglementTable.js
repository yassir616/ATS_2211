import "antd/dist/antd.css";
import { Select, Table } from "antd";
import React, { Component } from "react";
import { getReglements } from "../../../util/APIUtils";

const { Option } = Select;
class ReglementTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reglement: [],
    };
    this.columns = [
      {
        title: "Nom du fichier",
        dataIndex: "nomFichier",
        key: "nomFichier",
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle",
      },
      {
        title: "Type reglement",
        dataIndex: "reglementType",
        key: "reglementType",
      },

      {
        title: "Statut",
        dataIndex: "statut",
        render: (text, record) => {
          return (
            <span>
              <Select
                placeholder="Please select"
                style={{ width: "100%" }}
                defaultValue={text}
              >
                <Option value="EN_COURS">Valider</Option>
                <Option value="A_signer">Supprimer</Option>
              </Select>
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getAllReglement();
  }

  async getAllReglement() {
    let response = await getReglements();
    this.setState({
      reglement: response.data.content,
    });
  }

  render() {
    return (
      <Table
        rowClassName="editable-row"
        columns={this.columns}
        dataSource={this.state.reglement}
        pagination={false}
      />
    );
  }
}
export default ReglementTable;
