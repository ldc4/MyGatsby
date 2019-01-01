import React from 'react'
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.less';


class Layout extends React.Component {

  getHeader() {
    const { location } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    if (location.pathname === rootPath) {
      // 首页
      return <Header />
    } else {
      // 其他页面
      return <Header />
    }
  }

  render() {
    const { children } = this.props
    return (
      <div className={styles['container']}>
        {this.getHeader()}
        {children}
        <Footer />
      </div>
    )
  }
}

export default Layout
