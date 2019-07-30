import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import Layout from '../components/Layout/Layout'
import SEO from '../components/SEO/seo'
import Gitalk from 'gitalk'
import _ from 'lodash'
import './blog-post.less'
import 'gitalk/dist/gitalk.css'

class BlogPostTemplate extends React.Component {

  componentDidMount() {
    // 集成gitalk
    const title = _.get(this.props, 'data.markdownRemark.frontmatter.title');
    const option = _.get(this.props, 'data.allGitalkJson.edges[0].node');
    const id = location.pathname;
    if (location.host.indexOf('localhost') === -1) { // 本地开发避免创建issue
      const gitalk = new Gitalk(Object.assign(option, {
        id,
        title,
        distractionFreeMode: false
      }));
      gitalk.render('gitalk-container');
    }
  }

  render() {
    const { data = {}, location = {}, pageContext } = this.props;

    const { site = {}, markdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;
    const { previous, next } = pageContext;
    
    const { siteMetadata } = site;
    const { html = '', excerpt, frontmatter = {} } = markdownRemark;
    const { edges: navs = [] } = allNavigationJson;
    
    const { title, date, tags, category, draft } = frontmatter;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    // 处理前言
    let excerptHTML = '', postHTML = html;
    if (html.indexOf('<!-- more -->') !== -1) {
      excerptHTML = `<blockquote>${html.split('<!-- more -->')[0]}</blockquote>`;
      postHTML = html.split('<!-- more -->')[1];
    }

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO title={title} description={excerpt} />
        <div className="blog-header">
          <div className="blog-title">{title}</div>
          <div className="blog-info">
            <div className="blog-category">Under <Link to={`/cats/${kebabCase(category) || 'uncat'}/`}>{category || '未分类'}</Link></div>
            <div className="blog-date">On {date}</div>
            {draft && <div className="blog-draft">草稿</div>}
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
          <div id="gitalk-container"></div>
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
        draft
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
    allGitalkJson {
      edges {
        node {
          clientID
          clientSecret
          repo
          owner
          admin
        }
      }
    }
  }
`
