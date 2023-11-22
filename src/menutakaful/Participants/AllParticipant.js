import "antd/dist/antd.css";

import { Card } from "antd";
import React from "react";

import Participant from "./Participant";
import ParticipantMoral from "./ParticipantMoral";

const tabListNoTitle = [
  {
    key: "personnephysique",
    tab: "Personne physique"
  },
  {
    key: "personnemoral",
    tab: "Personne Morale"
  }
];

const contentListNoTitle = {
  personnephysique: <Participant />,
  personnemoral: <ParticipantMoral />
};

class AllParticipant extends React.Component {
  state = {
    key: "personnephysique",
    noTitleKey: "personnephysique"
  };

  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };

  render() {
    return (
      <div>
        <br />
        <Card
          style={{ width: "100%" }}
          tabList={tabListNoTitle}
          activeTabKey={this.state.noTitleKey}
          onTabChange={key => {
            this.onTabChange(key, "noTitleKey");
          }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}

export default AllParticipant;
