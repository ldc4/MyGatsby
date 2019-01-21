import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import dayjs from 'dayjs'

import Layout from '../components/Layout/Layout'
import { Row, Col } from '../components/Grids'
import SEO from '../components/SEO/seo'
import './index.less'

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
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="fragment-list page-content">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug;
            const date = dayjs(node.frontmatter.date).format('YYYY-MM-DD');
            const tags = node.frontmatter.tags || [];
            const category = node.frontmatter.category;
            const isDraft = process.env.NODE_ENV === 'production' && node.frontmatter.draft;
            return !isDraft && (
              <div className="fragment" key={node.fields.slug}>
                <div className="title">
                  <Link to={node.fields.slug}>
                    {title}
                  </Link>
                  {node.frontmatter.draft && <span>(草稿)</span>}
                </div>
                <div className="content">
                  <Row>
                    <Col span={4}>
                      <div className="date-and-category">
                        <div className="date">{date}</div>
                        <div className="category">
                          <Link to={`/cats/${kebabCase(category) || 'uncat'}/`}>{category || '未分类'}</Link>
                        </div>
                      </div>
                    </Col>
                    <Col span={14}>
                      <div className="excerpt" dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                    </Col>
                    <Col span={6}>
                      <div className="tags">
                        {tags.map((tag, index) => {
                          return (
                            <div className="tag-item" key={`${tag}-${index}`}>
                              <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                            </div>
                          )
                        })}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            )
          })}
        </div>
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
            draft
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
