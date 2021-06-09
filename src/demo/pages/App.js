import React, { Component } from 'react';
import TimeLine from 'libs/TimeLine';
import Generator from './Generator';
import './App.css';
import { differenceInCalendarDays } from "date-fns";

const config = {
  header: {
    top: {
      style: {
        background: "linear-gradient( grey, black)",
        textShadow: "0.5px 0.5px black",
        fontSize: 12,
      },
    },
    middle: {
      style: {
        background: "linear-gradient( orange, grey)",
        fontSize: 9,
      },
    },
    bottom: {
      style: {
        background: "linear-gradient( grey, black)",
        fontSize: 9,
        color: "orange",
      },
      selectedStyle: {
        background: "linear-gradient( #d011dd ,#d011dd)",
        fontWeight: "bold",
        color: "white",
      },
    },
  },

  // taskList: {
  //   //This part is somehow bugged. Bug occurs when you click on gannt -> other breadcrumb -> gannt.
  //   title: {
  //     label: "Task Todo",
  //     style: {
  //       background: "linear-gradient( grey, black)",
  //     },
  //   },
  //   task: {
  //     style: {
  //       backgroundColor: "grey",
  //       color: "white",
  //     },
  //   },

  //   verticalSeparator: {
  //     style: {
  //       backgroundColor: "#fbf9f9",
  //     },
  //     grip: {
  //       style: {
  //         backgroundColor: "red",
  //       },
  //     },
  //   },
  // },

  dataViewPort: {
    rows: {
      style: {
        backgroundColor: "white",
        borderBottom: "solid 0.5px silver",
      },
    },
    task: {
      showLabel: true,
      style: {
        whiteSpace: "nowrap",
        position: "absolute",
        borderRadius: 14,
        color: "white",
        textAlign: "center",
        backgroundColor: "grey",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      },
      selectedStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      },
    },
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    let result = Generator.generateData();
    this.data = result.data;
    this.state = {
      itemheight: 20,
      data: [],
      selectedItem: null,
      timelineMode: 'month',
      links: result.links,
      nonEditableName: false,
      showIdColumn: true,
      showNameColumn: true,
      showFromColumn: true,
      showToColumn: true,
      showDurationColumn: true,
      showPredecessorsColumn: true,
      showSuccessorsColumn: true,
    };
  }

  handleDayWidth = (e) => {
    this.setState({ daysWidth: parseInt(e.target.value) });
  };

  handleItemHeight = (e) => {
    this.setState({ itemheight: parseInt(e.target.value) });
  };

  onHorizonChange = (start, end) => {
    let result = this.data.filter((item) => {
      return (item.start < start && item.end > end) || (item.start > start && item.start < end) || (item.end > start && item.end < end);
    });
    console.log('Calculating ');
    this.setState({ data: result });
  };

  onSelectItem = (item) => {
    console.log(`Select Item ${item}`);
    this.setState({ selectedItem: item });
  };
  
  onUpdateTask = (item, props) => {
    item.start = props.start;
    item.end = props.end;
        const startingDate = new Date(item.start);
        let dayCount = 0;
        while (item.end > startingDate) {
          dayCount++;
          startingDate.setDate(startingDate.getDate() + 1);
        }
    item.duration = dayCount;
    this.setState({ data: [...this.state.data] });
    console.log(`Update Item ${item}`);
  };

  onCreateLink = (item) => {
    let newLink = Generator.createLink(item.start, item.end);
    this.setState({ links: [...this.state.links, newLink] });
    console.log(`Update Item ${item}`);
  };

  getbuttonStyle(value) {
    return this.state.timelineMode == value ? { backgroundColor: 'grey', boder: 'solid 1px #223344' } : {};
  }

  modeChange = (value) => {
    this.setState({ timelineMode: value });
  };

  genID() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
  }

  getRandomDate() {
    let result = new Date();
    result.setDate(result.getDate() + Math.random() * 10);
    return result;
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  addTask = () => {
    let today = new Date();
    let randomDate = this.getRandomDate();
    let newTask = {
      id: `${this.state.data.length}`,
      start: today,
      end: randomDate,
      name: 'New Task',
      color: this.getRandomColor(),
      predecessors: [],
      succesors: [],
      duration: differenceInCalendarDays(randomDate, today)
    };
    console.log(newTask);
    this.setState({ data: [...this.state.data ,newTask] });
  };

  delete = () => {
    console.log('On delete');
    if (this.state.selectedItem) {
      let index = this.state.links.indexOf(this.state.selectedItem);
      if (index > -1) {
        this.state.links.splice(index, 1);
        this.setState({ links: [...this.state.links] });
      }
      index = this.state.data.indexOf(this.state.selectedItem);
      if (index > -1) {
        this.state.data.splice(index, 1);
        this.setState({ data: [...this.state.data] });
      }
    }
  };

  setIdColumnVisability = () => {
    this.setState({ showIdColumn: !this.state.showIdColumn});
  }
  setNameColumnVisability = () => {
    this.setState({ showNameColumn: !this.state.showNameColumn});
  }
  setFromColumnVisability = () => {
    this.setState({ showFromColumn: !this.state.showFromColumn});
  }
  setToColumnVisability = () => {
    this.setState({ showToColumn: !this.state.showToColumn});
  }
  setDurationColumnVisability = () => {
    this.setState({ showDurationColumn: !this.state.showDurationColumn});
  }
  setPredecessorsColumnVisability = () => {
    this.setState({ showPredecessorsColumn: !this.state.showPredecessorsColumn});
  }
  setSuccessorsColumnVisability = () => {
    this.setState({ showSuccessorsColumn: !this.state.showSuccessorsColumn});
  }
  
  render() {
    return (
      <div className="app-container">
        <div className="nav-container">
          <div className="mode-container-title">Full Demo</div>
          <div className="mode-container">
            <div className="mode-container-item mode-container-item-left" onClick={(e) => this.modeChange('week')} style={this.getbuttonStyle('week')}>
              Week
            </div>
            <div className="mode-container-item" onClick={(e) => this.modeChange('month')} style={this.getbuttonStyle('month')}>
              Month
            </div>
            <div
              className="mode-container-item mode-container-item-right"
              onClick={(e) => this.modeChange('year')}
              style={this.getbuttonStyle('year')}
            >
              Year
            </div>
          </div>
        </div>
        <div className="time-line-container">
          <TimeLine
            config={config}
            data={this.state.data}
            links={this.state.links}
            onHorizonChange={this.onHorizonChange}
            onSelectItem={this.onSelectItem}
            onUpdateTask={this.onUpdateTask}
            onCreateLink={this.onCreateLink}
            mode={this.state.timelineMode}
            itemheight={this.state.itemheight}
            selectedItem={this.state.selectedItem}
            nonEditableName={this.state.nonEditableName}
            links={this.state.links}
            submitCallback={this.props.submitCallback}
            addTask={this.addTask}
            delete={this.delete}
            showIdColumn={this.state.showIdColumn}
            showNameColumn={this.state.showNameColumn}
            showFromColumn={this.state.showFromColumn}
            showToColumn={this.state.showToColumn}
            showDurationColumn={this.state.showDurationColumn}
            showPredecessorsColumn={this.state.showPredecessorsColumn}
            showSuccessorsColumn={this.state.showSuccessorsColumn}
          />
        </div>
        <div className="bottom-menu--wrapper">
          <div className="footer-buttons--wrapper">
             <div className="footer-buttons--wrapper">
                <div className="mode-button" onClick={this.addTask}>
                  <svg height={30} width={30} viewBox="0 0 48 48">
                    <path
                        fill="silver"
                        d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z"
                      />
                  </svg>
                </div>
                <div className="mode-button" onClick={this.delete}>
                  <svg height={30} width={30} viewBox="0 0 48 48">
                    <path fill="silver" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22H14v-4h20v4z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="footer--customizable-menu">
              <div className={"customization-button mode-container-item-left " + (this.state.showIdColumn ? "color-green" : "color-red")} onClick={this.setIdColumnVisability}>Id</div>
              <div className={"customization-button " + (this.state.showNameColumn ? "color-green" : "color-red")} onClick={this.setNameColumnVisability}>Name</div>
              <div className={"customization-button " + (this.state.showFromColumn ? "color-green" : "color-red")} onClick={this.setFromColumnVisability}>From</div>
              <div className={"customization-button " + (this.state.showToColumn ? "color-green" : "color-red")} onClick={this.setToColumnVisability}>To</div>
              <div className={"customization-button " + (this.state.showDurationColumn ? "color-green" : "color-red")} onClick={this.setDurationColumnVisability}>Duration</div>
              <div className={"customization-button " + (this.state.showPredecessorsColumn ? "color-green" : "color-red")} onClick={this.setPredecessorsColumnVisability}>Predecessor</div>
              <div className={"customization-button mode-container-item-right " + (this.state.showSuccessorsColumn ? "color-green" : "color-red")} onClick={this.setSuccessorsColumnVisability}>Successor</div>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
