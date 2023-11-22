import { Button, Row, Col } from "antd";
import "antd/dist/antd.css";
import React, { Component } from "react";
import { downloadFlux, listFiles } from "../EchangeFileAPI";

class FichiersEmis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listFiles: [],
    };
  }
  componentDidMount() {
    this.listFilesNames();
  }
  async listFilesNames() {
    let respo = await listFiles();
    this.setState({ listFiles: respo.data });
  }
  downloadFile = async (title) => {
    await downloadFlux(title)
      .then((rep) => {
        return new Blob([rep.data]);
      })
      .then((rep) => {
        let url = window.URL.createObjectURL(rep);
        let a = document.createElement("a");
        a.href = url;
        a.download = title;
        a.click();
      });
  };

  render() {
    return (
      <div>
        {this.state.listFiles === [] ? (
          <p>Aucun fichier</p>
        ) : (
          this.state.listFiles.map((title) => {
            return (
              <Row>
                <Col span={12} offset={1}>
                  {title}
                </Col>
                <Col>
                  <Button
                    onClick={() => {
                      this.downloadFile(title);
                    }}
                  >
                    Télécharger
                  </Button>
                </Col>
              </Row>
            );
          })
        )}
      </div>
    );
  }
}
export default FichiersEmis;
