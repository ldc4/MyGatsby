import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import SEO from '../components/SEO/seo'
import './blog-post.less';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const siteMetadata = this.props.data.site.siteMetadata;
    const { html, excerpt, frontmatter } = post;
    const { title, date, tags, category } = frontmatter;
    const { previous, next } = this.props.pageContext;

    return (
      <Layout location={this.props.location} metadata={siteMetadata}>
        <SEO title={title} description={excerpt} />
        <div className="blog-header">
          <div className="blog-title">{title}</div>
          <div className="blog-info">
            <div className="blog-category">Under <Link to="/">{category}</Link></div>
            <div className="blog-date">On {date}</div>
          </div>
          <div className="blog-info">
            <div className="blog-tags">
                {tags && tags.split(',').map((tag, index) => {
                return (
                  <div className="blog-tag" key={`${tag}-${index}`}>
                    <Link to="/">{tag}</Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="blog-content">
          <div className="blog-post" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="blog-over">
            <span className="over-l"></span>
            <span className="over-m">OVER</span>
            <span className="over-r"></span>
          </div>
          <div className="blog-footer">
            <div className="prev-post">
              {previous && (
                <div>
                  <span>上一篇：</span>
                  <Link to={previous.fields.slug} rel="prev">
                    {previous.frontmatter.title}
                  </Link>
                </div>
              )}
            </div>
            <div className="next-post">
              {next && (
                <div>
                  <span>下一篇：</span>
                  <Link to={next.fields.slug} rel="next">
                    {next.frontmatter.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        tags
        category
      }
    }
  }
`
