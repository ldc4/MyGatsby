import React from 'react';

export default class Col extends React.Component {
  render() {
    const className = this.props.className || '';
    return (
      <div className={`tc-g-u-${this.props.span}-24 ${className}`}>
        {this.props.children}
      </div>
    );
  }
}
