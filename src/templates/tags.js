import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import dayjs from 'dayjs'

import Layout from '../components/Layout/Layout'
import { Row, Col } from '../components/Grids'
import SEO from '../components/SEO/seo'
import './tags.less'

class TagsTemplate extends React.Component {

  render() {
    const { data = {}, location = {}, pageContext } = this.props;

    const { site = {}, tagMarkdownRemark = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;
    const { tag } = pageContext;

    const { siteMetadata } = site;
    const { edges: navs = [] } = allNavigationJson;
    // 特殊处理未标记
    let posts = [];
    if (tag) {
      posts = tagMarkdownRemark.edges || [];
    } else {
      const allPosts = allMarkdownRemark.edges || [];
      allPosts.forEach((post) => {
        const { tags } = post.node.frontmatter;
        if (!tags || tags.length === 0) {
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
          title={`tag-${tag}`}
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {tag ?
          <div className="fragment-header">
            <div className="title">标签</div>
            <div className="tag">{tag}</div>
          </div>:
          <div className="fragment-header">
            <div className="title">未标记</div>
          </div>  
        }
        <div className="fragment-list">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug;
            const date = dayjs(node.frontmatter.date).format('YYYY-MM-DD');
            const tags = node.frontmatter.tags || [];
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
                          <Link to="/">{category}</Link>
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

export default TagsTemplate

export const pageQuery = graphql`
  query BlogPostByTag($tag: String) {
    site {
      siteMetadata {
        title
        author
      }
    }
    tagMarkdownRemark: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
