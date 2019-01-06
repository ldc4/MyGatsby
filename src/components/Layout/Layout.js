import React from 'react'
import Header from './Header';
import Footer from './Footer';
import './Layout.less';


class Layout extends React.Component {

  render() {
    const { location, metadata, children } = this.props;
    return (
      <div className="layout-container">
        <div className="layout-content">
          <Header location={location} title={metadata.title} />
          <div className="layout-page">{children}</div>
        </div>
        <Footer author={metadata.author} />
      </div>
    )
  }
}

export default Layout
