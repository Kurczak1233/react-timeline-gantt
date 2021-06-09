import React, { Component } from 'react';
import Config from 'libs/helpers/config/Config';
import ContentEditable from 'libs/components/common/ContentEditable';
import { createPopper } from '@popperjs/core';
import Modal from 'react-modal';
import Select from 'react-select';
import { addDays , toDate} from "date-fns";

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
      submitCallback: null,
      duration: this.props.item.duration,
      inputHasChanged: false,
      setInputValue: '',
    }
    console.log(props)
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
    var splitDate = value.split('/');
    var month = splitDate[1] - 1;
    var date = new Date(splitDate[2], month, splitDate[0]);
    this.props.onUpdateTask(this.props.item, { start: date, end: this.props.item.end})
  };

  changeEndDate = (value) => {
    var splitDate = value.split('/');
    var month = splitDate[1] - 1;
    var date = new Date(splitDate[2], month, splitDate[0]);
    this.props.onUpdateTask(this.props.item, { start: this.props.item.start, end: date})
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

  handleSubmit = (predecessorId, successorId) => {
    console.log(predecessorId)
    console.log(successorId)
    if(predecessorId === successorId)
    {
      return null;
    }
    let predecessor = this.props.data.find(x=>x.id == successorId)
    let successor = this.props.data.find(x=>x.id == predecessorId)
    
    //Anti repeat validation
    if(!successor.predecessors.find(x=>x == predecessor.id))
    {
      successor.predecessors.push(predecessor.id);
    }
    if(!predecessor.succesors.find(x=>x == successor.id))
    {
      predecessor.succesors.push(successor.id);
    }

    // if(!predecessor.id === successor.id)
    // {
    //   predecessor.succesors.push(successor.id);
    // }
    // if(!predecessor.id===successor.id)
    // {
    //   succesors.predecessor.push(successor.id);
    // }

    this.props.onStartCreateLink(successor, 'LINK_POS_RIGHT');
    this.props.onFinishCreateLink(predecessor, undefined);

    let item = {start: {task: predecessor, position: 'LINK_POS_RIGHT'}, end: {task: successor, position: undefined}};
    this.props.onCreateLink(item);
  }

  changeDuration = (days) => {
    let daysDifference = days - this.props.item.duration;
    this.props.onUpdateTask(this.props.item, { start: this.props.item.start, end: addDays(new Date(this.props.item.end), daysDifference), duration: days})
  }

  componentDidMount = () => { 
    this.createOptions();
  }
  
  handleInputChange = () => {
    this.setState({ inputHasChanged: true });
    this.setState({ setInputValue: '' });
  }
  
  render() {
    console.log(this.state.inputHasChanged)
    return (
      <React.Fragment>        
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
      <div
        className="timeLine-side-task-row"
        style={{
          ...Config.values.taskList.task.style,
          top: this.props.top,
          height: this.props.itemheight
        }}
        onClick={(e) => this.props.onSelectItem(this.props.item)}
      >
          <div className="timeLine-side--header-wrapper">
          {this.props.showIdColumn ? (<div className="timeLine-side--header-wrapper--column-width-70 ">{this.props.item.id.substring(0,5)}</div> ) : ''}
          {this.props.showNameColumn ? ( <ContentEditable width="100%" value={this.props.item.name} index={this.props.index} onChange={this.onChange} />) : ''}
           {this.props.showFromColumn ? ( <ContentEditable width="100%" start={this.props.item.start} value={new Date(this.props.item.start).toLocaleDateString('en-GB')} index={this.props.index} onChange={this.changeStartDate} />) : ''}
           {this.props.showToColumn ? ( <ContentEditable width="100%" end={this.props.item.end} value={new Date(this.props.item.end).toLocaleDateString('en-GB')} index={this.props.index} onChange={this.changeEndDate} />) : ''}
           {this.props.showDurationColumn ? ( <ContentEditable width="70%" value={this.props.item.duration} index={this.props.index} onChange={this.changeDuration} />) : ''}
           {this.props.showPredecessorsColumn ? ( <ContentEditable handleInputChange={this.handleInputChange} width="70%" value={this.state.setInputValue} onChange={(value) => this.handleSubmit(this.props.item.id, value)}/>) : ''}
           {this.props.showSuccessorsColumn ? ( <ContentEditable handleInputChange={this.handleInputChange} width="70%" value={this.state.setInputValue} onChange={(value) => this.handleSubmit(value, this.props.item.id)}/>) : ''}

           {/* {this.props.showPredecessorsColumn ? ( <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button id="addChildButton" className="no-decoration" onClick={() => {
               this.createOptions(this.props.item.id);
                this.showAddDependencyModal(this.props.item.id, '') 
              }}><i className="fas fa-plus color-green cursor-pointer" /></button>
            </div> ) : ''}
            {this.props.showSuccessorsColumn ? (
            <div className="timeLine-side--header-wrapper--column-width-70 buttons-wrapper">
              <button className="no-decoration" onClick={() => {
                 this.createOptions(this.props.item.id);
                 this.showAddDependencyModal('', this.props.item.id)
                 }}><i className="fas fa-plus color-green cursor-pointer" /></button>
            </div>) : ''} */}
          </div>
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
          showIdColumn={this.props.showIdColumn}
          showNameColumn={this.props.showNameColumn}
          showFromColumn={this.props.showFromColumn}
          showToColumn={this.props.showToColumn}
          showDurationColumn={this.props.showDurationColumn}
          showPredecessorsColumn={this.props.showPredecessorsColumn}
          showSuccessorsColumn={this.props.showSuccessorsColumn}
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
               {this.props.showIdColumn ? <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Id</div> : ''} 
               {this.props.showNameColumn ? <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">Name</div> : ''} 
               {this.props.showFromColumn ? <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">From</div> : ''} 
               {this.props.showToColumn ? <div className="timeLine-side--header-wrapper--column-width-100 timeLine-side--text-no-wrap">To</div> : ''} 
               {this.props.showDurationColumn ? <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Duration</div> : ''} 
               {this.props.showPredecessorsColumn ? <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Predecessors</div> : ''} 
               {this.props.showSuccessorsColumn ? <div className="timeLine-side--header-wrapper--column-width-70 timeLine-side--text-no-wrap">Successors</div> : ''} 
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
