import * as React from 'react';

export default class Row extends React.Component {
  render() {
    return (
      <div className="tc-g">
        {this.props.children}
      </div>
    );
  }
}