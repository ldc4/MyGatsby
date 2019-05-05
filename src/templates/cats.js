import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import dayjs from 'dayjs'

import Layout from '../components/Layout/Layout'
import { Row, Col } from '../components/Grids'
import SEO from '../components/SEO/seo'
import './cats.less'

class CatsTemplate extends React.Component {

  render() {
    const { data = {}, location = {}, pageContext } = this.props;

    const { site = {}, catMarkdownRemark = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;
    const { cat } = pageContext;

    const { siteMetadata } = site;
    const { edges: navs = [] } = allNavigationJson;
    // 特殊处理未标记
    let posts = [];
    if (cat) {
      posts = catMarkdownRemark.edges || [];
    } else {
      const allPosts = allMarkdownRemark.edges || [];
      allPosts.forEach((post) => {
        const { category } = post.node.frontmatter;
        if (!category) {
          posts.push(post);
        }
      });
    }

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO
          title={`cat-${cat}`}
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="cats-page">
          <div className="fragment-header">
            {cat ?
              <div>
                <div className="title">分类</div>
                <div className="cat">{cat}</div>
              </div>
              :
              <div className="title">未分类</div>
            }
          </div>
          <div className="fragment-list">
            {posts.map(({ node }) => {
              const title = node.frontmatter.title || node.fields.slug;
              const date = dayjs(node.frontmatter.date).format('YYYY-MM-DD');
              const cats = node.frontmatter.cats || [];
              const category = node.frontmatter.category;
              return (
                <div className="fragment" key={node.fields.slug}>
                  <div className="title">
                    <Link to={node.fields.slug}>
                      {title}
                    </Link>
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
                        <div className="cats">
                          {cats.map((cat, index) => {
                            return (
                              <div className="cat-item" key={`${cat}-${index}`}>
                                <Link to={`/cats/${kebabCase(cat)}/`}>{cat}</Link>
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
        </div>
      </Layout>
    )
  }
}

export default CatsTemplate

export const pageQuery = graphql`
  query BlogPostByCat($cat: String) {
    site {
      siteMetadata {
        title
        author
      }
    }
    catMarkdownRemark: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { in: [$cat] } } }
    ) {
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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
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
