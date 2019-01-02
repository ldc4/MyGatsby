import React from 'react'
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.less';


class Layout extends React.Component {

  render() {
    const { location, children } = this.props
    return (
      <div className="container">
        <div className="content">
          <Header location={location} />
          <div className="page">{children}</div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
