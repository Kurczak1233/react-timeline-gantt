import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';

export class VerticalLine extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div className="timeLine-main-data-verticalLine" style={{ left: this.props.left }} />;
  }
}

export class TaskRow extends Component {
  constructor(props) {
    super(props);
  }

  onChange = (value) => {
    if (this.props.onUpdateTask) {
      this.props.onUpdateTask(this.props.item, { name: value, start: this.props.item.start, end: this.props.item.end });
    }
  };
  // onUpdateTask = (item, props) => {
  //   item.start = props.start;
  //   item.end = props.end;
  //   this.setState({ data: [...this.state.data] });
  //   console.log(`Update Item ${item}`);
  // };

  changeStartDate = (value) => {
      this.props.onUpdateTask(this.props.item, { start: new Date(value)})
  };

  changeEndDate = (value) => {
      this.props.onUpdateTask(this.props.item, { end: value });
  };


  render() {
    return (
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
          <div tabIndex={this.props.index} style={{ width: '100%' }}>
            {this.props.label}
          </div>
        ) : (
          <div className="timeLine-side--header-wrapper">
            <div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,1)}</div>
            <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />
            <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString()} index={this.props.index} onChange={this.changeStartDate} />
            <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString()} index={this.props.index} onChange={this.changeEndDate} />
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button className="no-decoration"><i className="fas fa-plus color-green"></i></button>
              <button className="no-decoration"><i className="fas fa-search color-blue"></i></button>
            </div>
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button className="no-decoration"><i className="fas fa-plus color-green"></i></button>
              <button className="no-decoration"><i className="fas fa-search color-blue"></i></button>
            </div>
          </div>
        )}
      </div>
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
        <div className="timeLine-side">
          <div className="timeLine-side-title" style={Config.values.taskList.title.style}>
            <div className="timeLine-side-title--custom-style">Task menu</div>
              <div className="timeLine-side--header-wrapper">
                <div className="timeLine-side--header-wrapper--column-width-70">Id</div>
                <div className="styleTest">Name</div>
                <div className="styleTest">From date</div>
                <div className="styleTest">To date</div>
                <div className="timeLine-side--header-wrapper--column-width-70">Next</div>
                <div className="timeLine-side--header-wrapper--column-width-70">Previous</div>
              </div>
          </div>
          <div ref="taskViewPort" className="timeLine-side-task-viewPort" onScroll={this.doScroll}>
            <div className="timeLine-side-task-container" style={this.containerStyle}>
              {this.renderTaskRow(data)}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
