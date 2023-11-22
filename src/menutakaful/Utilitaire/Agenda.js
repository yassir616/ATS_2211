import "./Agenda.css";
import { notification } from "antd";
import moment from "moment";
import React, { Component } from "react";
import { Modal, ReactAgenda, ReactAgendaCtrl } from "react-agenda";
import { connectedUserContext } from "../../app/App";
import { ajoutEvent, deleteEventById, updateEvent } from "./AgendaAPI";

var now = new Date();
var now1 = new Date();
var user_id = "";

require("moment/locale/fr.js");
var colors = {
  "color-1": "rgba(102, 195, 131 , 1)",
  "color-2": "rgba(242, 177, 52, 1)",
  "color-3": "rgba(235, 85, 59, 1)",
  "color-4": "rgba(70, 159, 213, 1)",
  "color-5": "rgba(170, 59, 123, 1)"
};

let dat = [];
let datas = [];
let datas1 = [];

export class Agenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selected: [],
      set: false,
      registre: [],
      cellHeight: 60 / 4,
      showModal: false,
      locale: "fr",
      rowsPerHour: 4,
      numberOfDays: 4,
      startDate: new Date()
    };
    this.handleRangeSelection = this.handleRangeSelection.bind(this);
    this.handleItemEdit = this.handleItemEdit.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.addNewEvent = this.addNewEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.changeView = this.changeView.bind(this);
    this.handleCellSelection = this.handleCellSelection.bind(this);
  }

  componentDidMount() {
    this.setState({});
    let array = [];
    for (let index of dat) {
      now1 = new Date(index.eventStartDate);
      now = new Date(index.eventEndDate);
      datas = {
        _id: index.id,
        name: index.eventDescription,
        startDateTime: new Date(
          now1.getFullYear(),
          now1.getMonth(),
          now1.getDate(),
          now1.getHours(),
          now1.getMinutes()
        ),
        endDateTime: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        ),
        classes: index.eventColor
      };
      array.push(datas);
    }
    this.setState({ items: array });
  }
  UNSAFE_componentWillReceiveProps(next, last) {
    if (next.items) {
      this.setState({ items: next.items });
    }
  }
  handleItemEdit(item, openModal) {
    if (item && openModal === true) {
      this.setState({ selected: [item] });
      return this._openModal();
    }
  }
  handleCellSelection(item, openModal) {
    if (this.state.selected && this.state.selected[0] === item) {
      return this._openModal();
    }
    this.setState({ selected: [item] });
  }
  zoomIn() {
    var num = this.state.cellHeight + 15;
    this.setState({ cellHeight: num });
  }
  zoomOut() {
    var num = this.state.cellHeight - 15;
    this.setState({ cellHeight: num });
  }
  handleDateRangeChange(startDate, endDate) {
    this.setState({ startDate: startDate });
  }
  handleRangeSelection(selected) {
    this.setState({ selected: selected, showCtrl: true });
    this._openModal();
  }
  _openModal() {
    this.setState({ showModal: true });
  }
  _closeModal(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ showModal: false });
  }
  handleItemChange(items, item) {
    this.setState({ items: items });
  }
  handleItemSize(items, item) {
    this.setState({ items: items });
  }
  async deleteEventId(id, userId) {
    try {
      await deleteEventById(id, userId);
      window.location.reload();
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }
  removeEvent = (items, item) => {
    const identify = item._id;
    this.deleteEventId(identify, user_id);
    var index = dat.indexOf(identify);
    dat.splice(index, 1);
    this.setState({ registre: dat });
  };
  async addEvents(body) {
    try {
      let response = await ajoutEvent(body);
      if (response.status === 200) {
        dat.push(response.data);
        this.setState({ registre: dat });
        let array1 = [];
        for (let index of dat) {
          var now2;
          var now3;
          now2 = new Date(index.eventStartDate);
          now3 = new Date(index.eventEndDate);
          datas1 = {
            _id: index.id,
            name: index.eventDescription,
            startDateTime: new Date(
              now2.getFullYear(),
              now2.getMonth(),
              now2.getDate(),
              now2.getHours(),
              now2.getMinutes()
            ),
            endDateTime: new Date(
              now3.getFullYear(),
              now3.getMonth(),
              now3.getDate(),
              now3.getHours(),
              now3.getMinutes()
            ),
            classes: index.eventColor
          };
          array1.push(datas1);
        }
        this.setState({ items: array1 });
      }
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }
  addNewEvent(test, newItems) {
    const eventRequest = {
      eventDescription: newItems.name,
      eventStartDate: newItems.startDateTime,
      eventEndDate: newItems.endDateTime,
      eventColor: newItems.classes,
      userId: user_id
    };
    this.addEvents(eventRequest);

    this._closeModal();
  }
  async updateEvents(id, body) {
    try {
      let response = await updateEvent(id, body);
      if (response.status === 200) {
        this.setState({ registre: response.data });
      }
      window.location.reload();
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
  }
  editEvent(values, item) {
    const updatedEvent = {
      eventDescription: item.name,
      eventStartDate: item.startDateTime,
      eventEndDate: item.endDateTime,
      eventColor: item.classes,
      userId: user_id
    };
    const identify = item._id;
    this.setState({ items: values });
    this.updateEvents(identify, updatedEvent);
    this.setState({ registre: values });
    this._closeModal();
  }
  changeView(days, event) {
    this.setState({ numberOfDays: days });
  }
  render() {
    return (
      <div className="content-expanded ">
        <connectedUserContext.Consumer>
          {value => (
            (user_id = value.id),
            (dat = value.events),
            (this.state.registre = value.events)
          )}
        </connectedUserContext.Consumer>
        <div className="control-buttons">
          <button className="button-control" onClick={this.zoomIn}>
            {" "}
            <i className="zoom-plus-icon"></i>{" "}
          </button>
          <button className="button-control" onClick={this.zoomOut}>
            {" "}
            <i className="zoom-minus-icon"></i>{" "}
          </button>
          <button className="button-control" onClick={this._openModal}>
            {" "}
            <i className="schedule-icon"></i>{" "}
          </button>
          <button
            className="button-control"
            onClick={this.changeView.bind(null, 7)}
          >
            {" "}
            {moment.duration(7, "days").humanize()}{" "}
          </button>
          <button
            className="button-control"
            onClick={this.changeView.bind(null, 4)}
          >
            {" "}
            {moment.duration(4, "days").humanize()}{" "}
          </button>
          <button
            className="button-control"
            onClick={this.changeView.bind(null, 3)}
          >
            {" "}
            {moment.duration(3, "days").humanize()}{" "}
          </button>
          <button
            className="button-control"
            onClick={this.changeView.bind(null, 1)}
          >
            {" "}
            {moment.duration(1, "day").humanize()}{" "}
          </button>
        </div>
        <ReactAgenda
          minDate={new Date(now.getFullYear(), now.getMonth() - 3)}
          maxDate={new Date(now.getFullYear(), now.getMonth() + 3)}
          startDate={this.state.startDate}
          startAtTime={8}
          endAtTime={23}
          cellHeight={this.state.cellHeight}
          locale="fr"
          items={this.state.items}
          numberOfDays={this.state.numberOfDays}
          headFormat={"ddd DD MMM"}
          rowsPerHour={this.state.rowsPerHour}
          itemColors={colors}
          helper={true}
          view="calendar"
          autoScale={false}
          fixedHeader={true}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
          onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onDateRangeChange={this.handleDateRangeChange.bind(this)}
        />
        {this.state.showModal ? (
          <Modal clickOutside={this._closeModal}>
            <div className="modal-content">
              <ReactAgendaCtrl
                items={this.state.items}
                itemColors={colors}
                selectedCells={this.state.selected}
                Addnew={this.addNewEvent}
                edit={this.editEvent}
              />
            </div>
          </Modal>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Agenda;
