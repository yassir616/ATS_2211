import "antd/dist/antd.css";
import { Button, Card, Drawer } from "antd";
import React, { Component } from "react";
import { MyContext } from "./ComptabiliteRetraite";
import CotisationRetraite from "./CotisationRetraite";

const tabListNoTitle = [
  {
    key: "cotisation",
    tab: "Cotisation",
  },
];

class DetailsCotisationRetraite extends Component {
  state = {
    key: "cotisation",
    noTitleKey: "cotisation",
    visible: false,
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };
  contentListNoTitle = {
    cotisation: <CotisationRetraite />,
  };

  render() {
    return (
      <div>
        <MyContext.Consumer>
          {(context) => (
            <React.Fragment>
              <a
                href="#top"
                type="primary"
                shape="circle"
                icon="edit"
                size="small"
                onClick={this.showDrawer}
              >
                {context.state.numeroContrat}
              </a>
              <Drawer
                title={
                  <div style={{ fontSize: "18px" }}>
                    Détails du Contrat : {context.state.numeroContrat}
                  </div>
                }
                width={1400}
                onClose={this.onClose}
                visible={this.state.visible}
                bodyStyle={{ paddingBottom: 80 }}
              >
                <Card
                  tabList={tabListNoTitle}
                  activeTabKey={this.state.noTitleKey}
                  onTabChange={(key) => {
                    this.onTabChange(key, "noTitleKey");
                  }}
                >
                  {this.contentListNoTitle[this.state.noTitleKey]}
                </Card>
                <div className="submit-cancel">
                  <Button
                    type="primary"
                    className="not-rounded"
                    onClick={this.onClose}
                  >
                    Fermer
                  </Button>
                </div>
              </Drawer>
            </React.Fragment>
          )}
        </MyContext.Consumer>
      </div>
    );
  }
}
export default DetailsCotisationRetraite;
