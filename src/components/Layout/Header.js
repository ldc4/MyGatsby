import React from 'react'
import { Logo } from '../../graphql';
import './Header.less'


class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="logo">
          <div className="img">
            <a href="http://www.baidu.com"><Logo /></a>
          </div>
          <div className="title">LDC4</div>
        </div>
      </div>
    )
  }
}



export default Header;
