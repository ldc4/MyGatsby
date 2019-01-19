import React from 'react'
import { Logo } from '../../graphql';
import { Link } from "gatsby"
import './Header.less'


class Header extends React.Component {
  render() {
    const { pathname, title, navs } = this.props;
    
    // 处理末尾"/"
    const reg = new RegExp(`\/$`);
    const rePathname = pathname.replace(reg, '');

    return (
      <div className="header">
        <div className={`logo ${rePathname === '' ? 'active' : ''}`}>
          <Link to="/">
            <div className="img">
              <Logo />
            </div>
            <div className="title">{title}</div>
          </Link>
        </div>
        <div className="nav">
          <ul className="nav-list">
            {navs.map(({ node }, index) => {
              return (
                <Link key={`${node.link}-${index}`} to={node.link}>
                  <li className={rePathname === `${node.link}` ? 'active' : ''}>
                    {node.name}
                  </li>
                </Link>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}



export default Header;
