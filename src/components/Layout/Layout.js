import React from 'react'
import Header from './Header';
import Footer from './Footer';
import './Layout.less';


class Layout extends React.Component {
  render() {
    const { type = 'base', pathname, metadata = {}, navs, children } = this.props;
    const { title, author } = metadata;
    if (type === 'one-screen') {
      return (
        <div className="os-layout-container">
          <Header pathname={pathname} title={title} navs={navs} />
          <div className="os-layout-content">
            <div className="os-layout-page">{children}</div>
          </div>
          <Footer mode="rainbow" author={author} />
        </div>
      )
    }
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
