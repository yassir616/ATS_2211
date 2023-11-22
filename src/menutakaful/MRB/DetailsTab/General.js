import "antd/dist/antd.css";
import { Col, Collapse, Row } from "antd";
import React, { Component } from "react";

import { MyContext } from "../ConsultationsContratsMrb";
const { Panel } = Collapse;

class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left"
    };
  }
  render() {
    const { expandIconPosition } = this.state;
    return (
      <MyContext.Consumer>
        {context => (
          <React.Fragment>
            <div>
              <Collapse
                defaultActiveKey={["1"]}
                expandIconPosition={expandIconPosition}
              >
                <Panel
                  header="Souscripteur"
                  key="1"
                  extra={
                    <div style={{ fontSize: "13px" }}>
                      CIN : {context.state.souscripteur.cin}
                    </div>
                  }
                >
                  <div>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Nom</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.nom}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Prénom</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.prenom}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- CIN</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.cin}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Date naissance</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.dateNaissance}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Situation familiale
                        </h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.situationFamiliale}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Profession</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.profession.libelle}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Nationalité</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.nationalite}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Matricule</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.souscripteur.matricule}</p>
                      </Col>
                    </Row>
                  </div>
                </Panel>
                <Panel
                  header="Assuré"
                  key="2"
                  extra={
                    <div style={{ fontSize: "13px" }}>
                      CIN : {context.state.assure.cin}
                    </div>
                  }
                >
                  <div>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Nom</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.nom}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Prénom</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.prenom}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- CIN</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.cin}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Date naissance</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.dateNaissance}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.03)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>
                          - Situation familiale
                        </h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.situationFamiliale}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Profession</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.profession.libelle}</p>
                      </Col>
                    </Row>
                    <Row
                      style={{
                        backgroundColor: "rgb(0,0,0,0.00)",
                        marginTop: "10px"
                      }}
                    >
                      <Col span={4} offset={1}>
                        <h4 style={{ fontWeight: "blod" }}>- Nationalité</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.nationalite}</p>
                      </Col>
                      <Col span={4} offset={2}>
                        <h4 style={{ fontWeight: "blod" }}>- Matricule</h4>
                      </Col>
                      <Col span={4} offset={2}>
                        <p>{context.state.assure.matricule}</p>
                      </Col>
                    </Row>
                  </div>
                </Panel>
              </Collapse>
            </div>
          </React.Fragment>
        )}
      </MyContext.Consumer>
    );
  }
}

export default General;
