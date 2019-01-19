import React from 'react';
import { Link, graphql } from 'gatsby';
import { kebabCase, findIndex } from 'lodash';

import Layout from '../components/Layout/Layout';
import SEO from '../components/SEO/seo';
import './tags.less';

class TagsPage extends React.Component {

  getTagsHTML(tags) {
    let tagsHTML = [];
    tags.forEach((tag, index) => {
      tagsHTML.push((
        <div className="tag" key={`col-${index}`}>
          <Link to={`/tags/${tag.tagLink}`}>
            <div className="tag-value">{tag.tagValue}</div>
            <div className="tag-count">{tag.tagCount}</div>
          </Link>
        </div>
      ));
    });
    return <div className="tags-wrap page-content">{tagsHTML}</div>
  }

  render() {
    const { data = {}, location = {} } = this.props;

    const { site = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;

    const { siteMetadata } = site;
    const { edges: tags } = allMarkdownRemark;
    const { edges: navs } = allNavigationJson;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO
          title="All tags"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {this.getTagsHTML(dealWithTags(tags))}
      </Layout>
    )
  }
}


export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
      }
    }
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            tags
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
/**
将graphql查询的结果进行处理
原数据结果：
[
  {
    "node": {
      "frontmatter": {
        "tags": ["aaa", "bbb"]
      }
    }
  }
]
处理为：
[
  {
    "tagValue": "aaa",
    "tagLink": "aaa",
    "tagCount": 1
  },
  {
    "tagValue": "bbb",
    "tagLink": "bbb",
    "tagCount": 1
  }
]
另外，进行一些边界处理
*/
function dealWithTags(arr) {
  // 将多个tag先拆分出来
  const result = [];
  let noTagCount = 0; // 统计没有tag的个数
  arr.forEach((item) => {
    const { tags } = item.node.frontmatter;
    if (tags && tags.length > 0) {
      tags.forEach((tag) => {
        const index = findIndex(result, (node) => (node.tagValue === tag));
        if (index >= 0) {
          result[index]['tagCount']++;
        } else {
          result.push({
            tagValue: tag,
            tagLink: kebabCase(tag),
            tagCount: 1,
          })
        }
      })
    } else {
      noTagCount++;
    }
  });
  if (noTagCount > 0) {
    result.push({
      tagValue: '未标记',
      tagLink: 'untag',
      tagCount: noTagCount,
    });
  }
  return result;
}