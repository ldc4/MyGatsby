import React from 'react'
import { Logo } from '../../graphql';
import { Link } from "gatsby"
import './Header.less'


class Header extends React.Component {
  render() {
    const { location, title } = this.props;
    const { pathname } = location;
    const rootPath = `${__PATH_PREFIX__}/`;
    return (
      <div className="header">
        <div className={`logo ${pathname === rootPath ? 'active' : ''}`}>
          <Link to="/">
            <div className="img">
              <Logo />
            </div>
            <div className="title">{title}</div>
          </Link>
        </div>
        <div className="nav">
          <ul className="nav-list">
            {/* <li className={pathname === '/test1' ? 'active' : ''}>
              <Link to="/test1">归档</Link>
            </li>
            <li className={pathname === '/test2' ? 'active' : ''}>
              <Link to="/test2">关于</Link>
            </li> */}
          </ul>
        </div>
      </div>
    )
  }
}



export default Header;
