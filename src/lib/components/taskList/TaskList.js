import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';
import { createPopper } from '@popperjs/core';
import Modal from 'react-modal';

export class VerticalLine extends Component {
  constructor(props) {
    super(props);
    }
  render() {
    return <div className="timeLine-main-data-verticalLine" style={{ left: this.props.left }} />;
  }
}

Modal.setAppElement('#react-container')

export class TaskRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    }
  }

  onChange = (value) => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value, start: this.props.item.start, end: this.props.item.end });
    }
  };

  changeStartDate = (value) => {
      this.props.onUpdateTask(this.props.item, { start: new Date(value), end: this.props.item.end})
  };

  changeEndDate = (value) => {
    this.props.onUpdateTask(this.props.item, { start: this.props.item.start, end: new Date(value)})
  };
//this.props.onFinishCreateLink(this.props.item, position); onClick ta funkcja?

  createToolTip = () => {
    const tooltip = document.querySelector('#tooltip').removeAttribute("hidden");
    const button = document.querySelector('#addChildButton');
    createPopper(button, tooltip);
  }

  showModal = () => {
    this.setState({isModalOpen: true})
  }
  
  handleCloseModal = () => {
    this.setState({isModalOpen: false})
  }
  

  render() {
    console.log(this.state.isModalOpen)
    return (
      <React.Fragment>        
        <Modal
        isOpen={this.state.isModalOpen}
        onRequestClose={this.handleCloseModal}
        className="modal--custom-style"
        overlayClassName="overlay"
        id="newTaskModal"
        ariaHideApp={false}
        >
          <div>HELLO!
            <button onClick={this.handleCloseModal}>CLICK</button>
          </div>
        </Modal>
      <div
        className="timeLine-side-task-row"
        style={{
          ...Config.values.taskList.task.style,
          top: this.props.top,
          height: this.props.itemheight
        }}
        onClick={(e) => this.props.onSelectItem(this.props.item)}
      >
        {this.props.nonEditable ? (
          <div className="timeLine-side--header-wrapper">
          <div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,1)}</div>
          <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />
          <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeStartDate} />
          <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeEndDate} />
          {/* <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
            <button id="addChildButton" className="no-decoration" onClick={this.createToolTip}>
              <i className="fas fa-plus color-green" />
            </button>
            <div id="tooltip" hidden role="tooltip">My tooltip</div>
            <button className="no-decoration">
              <i className="fas fa-search color-blue" />
            </button>
          </div>
          <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
            <button className="no-decoration"><i className="fas fa-plus color-green"></i></button>
            <button className="no-decoration"><i className="fas fa-search color-blue"></i></button>
          </div> */}
        </div>
        ) : (
          <div className="timeLine-side--header-wrapper">
            <div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,1)}</div>
            <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />
            <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeStartDate} />
            <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeEndDate} />
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button id="addChildButton" className="no-decoration" onClick={this.createToolTip}>
                <i className="fas fa-plus color-green" />
              </button>
              <button className="no-decoration">
                <i className="fas fa-search color-blue" />
              </button>
            </div>
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button className="no-decoration"><i className="fas fa-plus color-green" /></button>
              <button className="no-decoration"><i className="fas fa-search color-blue" /></button>
            </div>
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper" onClick={this.showModal}>
              <button className="no-decoration"><i className="fas fa-info-circle color-blue" /></button>
            </div>
          </div>
        )}
      </div>
      </React.Fragment>
    );
  }
}

export default class TaskList extends Component {
  constructor(props) {
    super(props);
  }

  getContainerStyle(rows) {
    let new_height = rows > 0 ? rows * this.props.itemheight : 10;
    return { height: new_height };
  }

  renderTaskRow(data) {
    let result = [];
    for (let i = this.props.startRow; i < this.props.endRow + 1; i++) {
      let item = data[i];
      if (!item) break;
      result.push(
        <TaskRow
          key={i}
          index={i}
          item={item}
          label={item.name}
          top={i * this.props.itemheight}
          itemheight={this.props.itemheight}
          isSelected={this.props.selectedItem == item}
          onUpdateTask={this.props.onUpdateTask}
          onSelectItem={this.props.onSelectItem}
          nonEditable={this.props.nonEditable}
        />
      );
    }
    return result;
  }

  doScroll = () => {
    this.props.onScroll(this.refs.taskViewPort.scrollTop);
  };

  render() {
    let data = this.props.data ? this.props.data : [];
    this.containerStyle = this.getContainerStyle(data.length);
    
    return (
      
      <React.Fragment>
        {this.props.nonEditable ? (
        <div className="timeLine-side">
        <div className="timeLine-side-title" style={Config.values.taskList.title.style}>
          <div className="timeLine-side-title--custom-style">Task menu</div>
            <div className="timeLine-side--header-wrapper">
              <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Id</div>
              <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">Name</div>
              <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">From date</div>
              <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">To date</div>
            </div>
        </div>
        <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
          <div className="timeLine-side-task-container" style={this.containerStyle}>
            {this.renderTaskRow(data)}
          </div>
        </div>
      </div>) : ( <div className="timeLine-side">
          <div className="timeLine-side-title" style={Config.values.taskList.title.style}>
            <div className="timeLine-side-title--custom-style">Task menu</div>
              <div className="timeLine-side--header-wrapper">
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Id</div>
                <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">Name</div>
                <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">From date</div>
                <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">To date</div>
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Successors</div>
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Predecessors</div>
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Details</div>
              </div>
          </div>
          <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
            <div className="timeLine-side-task-container" style={this.containerStyle}>
              {this.renderTaskRow(data)}
            </div>
          </div>
        </div>
        )}
      </React.Fragment>
    );
  }
}
