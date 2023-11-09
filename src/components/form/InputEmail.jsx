import React from 'react';
import PropTypes from 'prop-types';

class InputEmail extends React.Component {
  render() {
    const { changeEvent } = this.props;
    const value = this.props.value ? this.props.value : '';

    return (
        <input
          type="text"
          className={`${this.props.classes} form-control`}
          name={this.props.name}
          onChange={e => changeEvent(e.target.value, e)}
          placeholder={this.props.placeholder}
          value={value}
        />
    );
  }
}

InputEmail.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  changeEvent: PropTypes.func,
};

export default InputEmail;
