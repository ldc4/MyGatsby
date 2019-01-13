import React from 'react'
import Header from './Header';
import Footer from './Footer';
import './Layout.less';


class Layout extends React.Component {
  render() {
    const { pathname, metadata = {}, navs, children } = this.props;
    const { title, author } = metadata;
    return (
      <div className="layout-container">
        <div className="layout-content">
          <Header pathname={pathname} title={title} navs={navs} />
          <div className="layout-page">{children}</div>
        </div>
        <Footer author={author} />
      </div>
    )
  }
}

export default Layout
