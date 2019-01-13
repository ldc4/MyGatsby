import React from 'react'
import { Link, graphql } from 'gatsby'
import dayjs from 'dayjs';

import Layout from '../components/Layout/Layout';
import { Row, Col } from '../components/Grids';
import SEO from '../components/SEO/seo';
import './index.less';

class BlogIndex extends React.Component {
  render() {
    const { data = {}, location = {} } = this.props;

    const { site = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;

    const { siteMetadata } = site;
    const { edges: posts = [] } = allMarkdownRemark;
    const { edges: navs = [] } = allNavigationJson;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        todo
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt(format: HTML)
          fields {
            slug
          }
          frontmatter {
            date
            title
            tags
            category
          }
        }
      }
    }
    allNavigationJson {
      edges {
        node {
          name
          link
        }
      }
    }
  }
`
