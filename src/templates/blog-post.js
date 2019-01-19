import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import Layout from '../components/Layout/Layout'
import SEO from '../components/SEO/seo'
import './blog-post.less';

class BlogPostTemplate extends React.Component {
  render() {
    const { data = {}, location = {}, pageContext } = this.props;

    const { site = {}, markdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;
    const { previous, next } = pageContext;
    
    const { siteMetadata } = site;
    const { html = '', excerpt, frontmatter = {} } = markdownRemark;
    const { edges: navs = [] } = allNavigationJson;
    
    const { title, date, tags, category } = frontmatter;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    // 处理前言
    let excerptHTML = '', postHTML = html;
    if (html.indexOf('<!-- end -->') !== -1) {
      excerptHTML = `<blockquote>${html.split('<!-- end -->')[0]}</blockquote>`;
      postHTML = html.split('<!-- end -->')[1];
    }

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO title={title} description={excerpt} />
        <div className="blog-header">
          <div className="blog-title">{title}</div>
          <div className="blog-info">
            <div className="blog-category">Under <Link to="/">{category}</Link></div>
            <div className="blog-date">On {date}</div>
          </div>
          <div className="blog-info">
            <div className="blog-tags">
                {tags && tags.map((tag, index) => {
                return (
                  <div className="blog-tag" key={`${tag}-${index}`}>
                    <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="blog-content page-content">
          {excerptHTML && <div className="blog-excerpt" dangerouslySetInnerHTML={{ __html: excerptHTML }} />}
          <div className="blog-post" dangerouslySetInnerHTML={{ __html: postHTML }} />
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
