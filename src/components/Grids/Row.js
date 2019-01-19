import React from 'react';

export default class Row extends React.Component {
  render() {
    const className = this.props.className || '';
    return (
      <div className={`row-g ${className}`}>
        {this.props.children}
      </div>
    );
  }
}