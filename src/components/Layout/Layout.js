import React from 'react'
import Header from './Header';
import Footer from './Footer';
import './Layout.less';


class Layout extends React.Component {

  render() {
    const { location, siteMetadata = {}, navs, children } = this.props;
    const { title, author } = siteMetadata;
    return (
      <div className="layout-container">
        <div className="layout-content">
          <Header location={location} title={title} navs={navs} />
          <div className="layout-page">{children}</div>
        </div>
        <Footer author={author} />
      </div>
    )
  }
}

export default Layout
