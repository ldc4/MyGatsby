import React from 'react'
import './Footer.less';


class Footer extends React.Component {
  render() {
    const { author } = this.props;
    return (
      <div className="footer">
        <div className="author">Theme By {author}</div>
        <div className="location">
          <i className="location-icon" />
          <span>ShenZhen - China</span>
        </div>
      </div>
    )
  }
}

export default Footer;
