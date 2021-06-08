import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';
import { createPopper } from '@popperjs/core';
import Modal from 'react-modal';
import Select from 'react-select';

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
      isDetailsModalOpen: false,
      isDependenciesInfoModalOpen: false,
      isAddDependencyModalOpen: false,
      sentPredecessorId: null,
      sentSuccessorId: null,
      taskToCreate: null,
      options: [],
      selectedOption: null,
      isMenuOpened: false,
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

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

  showDetailsModal = () => {
    this.setState({isDetailsModalOpen: true})
  }
  showDependenciesInfoModal = () => {
    this.setState({isDependenciesInfoModalOpen: true})
  }
  showAddDependencyModal = (successorId, predecessorId) => {
    this.setState({isAddDependencyModalOpen: true})
    this.setState({sentPredecessorId: predecessorId, sentSuccessorId: successorId})
  }
  
  handleCloseDetailsModal = () => {
    this.setState({isDetailsModalOpen: false})
  }
  handleCloseDependenciesInfoModal = () => {
    this.setState({isDependenciesInfoModalOpen: false})
  }
  handleCloseAddDependencyModal = () => {
    this.setState({isAddDependencyModalOpen: false})
  }

  handleSuccessorIdChange = (event) => {
    this.setState({sentSuccessorId: event.value});
  }
   
  handlePredecessorIdChange = (event) => {
    this.setState({sentPredecessorId: event.value});
  }

  createOptions = () => {
    let options = [];
    this.props.data.map((x)=>{
        options.push({value: x.id, label: x.id}) 
    })
    this.setState({options: options});
  }

  setIsOpenMenu = () => {
    this.setState({isMenuOpened: !this.state.isMenuOpened});
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let predecessor = this.props.data.find(x=>x.id == this.state.sentSuccessorId)
    let successor = this.props.data.find(x=>x.id == this.state.sentPredecessorId)
    
    //Anti repeat validation
    if(!successor.predecessors.find(x=>x == predecessor.id))
    {
      successor.predecessors.push(predecessor.id);
    }
    if(!predecessor.succesors.find(x=>x == successor.id))
    {
      predecessor.succesors.push(successor.id);
    }

    this.props.onStartCreateLink(successor, 'LINK_POS_RIGHT');
    this.props.onFinishCreateLink(predecessor, undefined);

    let item = {start: {task: predecessor, position: 'LINK_POS_RIGHT'}, end: {task: successor, position: undefined}};
    this.props.onCreateLink(item);
    this.handleCloseAddDependencyModal();
  }


  componentDidMount = () => { 
    this.createOptions();
  }

  updateOptions = (option) => {
    console.log(option);
    //this.setState({options: options});
  }

  // customStyles = {
  //   menu: (provided, state) => ({
  //     ...provided,
  //     height: '150px'
  //   })
  // }

  render() {
    return (
      <React.Fragment>        
        <Modal
        isOpen={this.state.isDetailsModalOpen}
        onRequestClose={this.handleCloseDetailsModal}
        className="modal-details--custom-style"
        overlayClassName="overlay"
        id="detailsModal"
        ariaHideApp={false}
        >
          <div className="details-modal--wrapper">
            <div>Id: {this.props.item.id}</div>
            <div>Name: {this.props.item.name}</div>
            <div>Duration: {this.props.item.duration}</div>
            <div>Start: {this.props.item.start.toLocaleDateString()}</div>
            <div>End: {this.props.item.end.toLocaleDateString()}</div>
            <div>Successors: {this.props.item.succesors.map(x=> <span> {x} </span>)}</div>
            <div>Predecessors: {this.props.item.predecessors.map(x=> <span> {x} </span>)}</div>
            <hr />
            <button type="submit" className="button--common-style" onClick={this.handleCloseDetailsModal}>CLOSE</button>
          </div>
        </Modal>
        <Modal
        isOpen={this.state.isAddDependencyModalOpen}
        onRequestClose={this.handleCloseAddDependencyModal}
        className="modal-details--custom-style"
        overlayClassName="overlay"
        id="addDependencyModal"
        ariaHideApp={false}
        >         
        <div className="add-dependency-modal--wrapper">
          <div>Add task dependency:</div>
          <br />
            <form onSubmit={this.handleSubmit}>
              <label>Predecessor task Id:</label> 
                  <Select
                  styles={this.customStyles}
                  value={this.state.options.find(x=>x.value == this.state.sentPredecessorId)}
                  onChange={this.handlePredecessorIdChange}
                  options={this.state.options}
                  maxMenuHeight={85}
                />
              <br />  
              <label>Successor task Id:</label>
                <Select
                value={this.state.options.find(x=>x.value == this.state.sentSuccessorId)}
                onChange={this.handleSuccessorIdChange}
                options={this.state.options}
                maxMenuHeight={85}
                />
              <br />
              <hr />
              <div className="multiple-buttons--wrapper">
                <button type="submit" className="button--common-style">SAVE</button>
              </div>
            </form>
        </div>
      </Modal>
        <Modal
        isOpen={this.state.isDependenciesInfoModalOpen}
        onRequestClose={this.handleCloseDependenciesInfoModal}
        className="modal-details--custom-style"
        overlayClassName="overlay"
        id="checkDependenciesModal"
        ariaHideApp={false}
        >
        <div>
            <div>Dependencies info:</div> 
            <form>
              {/* dodać zmienną jak jest to odpowiedni przedział */}
              <label>Predecessor task Id:</label> 
              <label>Successor task Id:</label>
            </form>
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
          <div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,5)}</div>
          <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />
          <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeStartDate} />
          <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeEndDate} />
          <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper" onClick={this.showDetailsModal}>
              <button className="no-decoration" ><i className="fas fa-info-circle color-blue cursor-pointer" /></button>
            </div>
        </div>
        ) : (
          <div className="timeLine-side--header-wrapper">
            <div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,5)}</div>
            <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />
            <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeStartDate} />
            <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString("en-US")} index={this.props.index} onChange={this.changeEndDate} />
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button id="addChildButton" className="no-decoration" onClick={() => {
                this.createOptions(this.props.item.id);
                this.showAddDependencyModal(this.props.item.id, '')
              }}><i className="fas fa-plus color-green cursor-pointer" /></button>
              <button className="no-decoration" onClick={this.showDependenciesInfoModal}><i className="fas fa-search color-blue cursor-pointer" /></button>
            </div>
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button className="no-decoration" onClick={() => {
                 this.createOptions(this.props.item.id);
                 this.showAddDependencyModal('', this.props.item.id)
                 }}><i className="fas fa-plus color-green cursor-pointer" /></button>
              <button className="no-decoration" onClick={this.showDependenciesInfoModal}><i className="fas fa-search color-blue cursor-pointer" /></button>
            </div>
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper" onClick={this.showDetailsModal}>
              <button className="no-decoration" ><i className="fas fa-info-circle color-blue cursor-pointer" /></button>
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
          onStartCreateLink={this.props.onStartCreateLink}
          onFinishCreateLink={this.props.onFinishCreateLink}
          onCreateLink={this.props.onCreateLink}
          data={this.props.data}
          links={this.props.links}
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
              <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">Details</div>
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
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Predecessors</div>
                <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Successors</div>
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
