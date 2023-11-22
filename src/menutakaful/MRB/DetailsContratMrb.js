import "antd/dist/antd.css";
import { Button, Card, Drawer } from "antd";
import React, { Component } from "react";
import ContratMrb from "./DetailsTab/ContratMrb";
import General from "./DetailsTab/General";
import ProduitMrb from "./DetailsTab/ProduitMrb";
import SinistreMrb from "./DetailsTab/SinistreMrb";
import { MyContext } from "./ConsultationsContratsMrb";

const tabListNoTitle = [
  {
    key: "general",
    tab: "Général"
  },
  {
    key: "contrat",
    tab: "Contrat"
  },
  {
    key: "produit",
    tab: "Produit"
  },
  {
    key: "sinistre",
    tab: "Sinistre"
  }
];

class DetailsContratMrb extends Component {
  state = {
    key: "general",
    noTitleKey: "general",
    visible: false
  };

  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  contentListNoTitle = {
    general: <General />,
    contrat: <ContratMrb />,
    produit: <ProduitMrb />,
    sinistre: <SinistreMrb />
  };

  render() {
    return (
      <div>
        <MyContext.Consumer>
          {context => (
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
                width={1000}
                onClose={this.onClose}
                visible={this.state.visible}
                bodyStyle={{ paddingBottom: 80 }}
              >
                <Card
                  tabList={tabListNoTitle}
                  activeTabKey={this.state.noTitleKey}
                  onTabChange={key => {
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
export default DetailsContratMrb;
