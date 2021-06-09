import React, { Component } from 'react';
export default class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.isFocus = false;
    this.state = {
      editing: false,
      value: this.props.value
    };
    this.width = this.props.width
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.textInput && !this.isFocus) {
      this.refs.textInput.focus();
      this.isFocus = true;
    }
  }

  onFocus = () => {
    this.setState({ editing: true });
  };

  onBlur = () => {
    this.finishEditing();
  };

  handleKey = (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      this.finishEditing();
    }
  };

  finishEditing = () => {
    this.isFocus = false;
    this.setState({ editing: false });
    if (this.props.onChange) this.props.onChange(this.state.value);
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  renderDiv = () => {
    return (
      <div tabIndex={this.props.index} className="timeLine-side--text-no-wrap " onClick={this.onFocus} onFocus={this.onFocus} style={{ width: this.width }}>
        {(this.state.value === '' ? <span>Add...</span> : '')}
        {this.state.value}
      </div>
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value != this.props.value) {
      this.state.value = nextProps.value;
    }
    return true;
  }

  renderEditor = () => {
    console.log(this.state.value)
    return (
      <input
        ref="textInput"
        onBlur={this.onBlur}
        className="timeLine-side--text-no-wrap time-line--input"
        style={{ outlineColor: 'black', outlineStyle: 'oinset' }}
        type="text"
        name="name"
        autoComplete="off"
        value={this.state.value}
        onKeyUp={this.handleKey}
        onChange={this.handleChange}
      />
    );
  };

  render() {
    return this.state.editing ? this.renderEditor() : this.renderDiv();
  }
}
