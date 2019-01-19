import React from 'react';
import { Link, graphql } from 'gatsby';
import { kebabCase, findIndex } from 'lodash';

import Layout from '../components/Layout/Layout';
import SEO from '../components/SEO/seo';
import './cats.less';

class CatsPage extends React.Component {

  getCatsHTML(cats) {
    let catsHTML = [];
    cats.forEach((cat, index) => {
      catsHTML.push((
        <div className="cat" key={`col-${index}`}>
          <Link to={`/cats/${cat.catLink}`}>
            <div className="cat-value">{cat.catValue}</div>
            <div className="cat-count">{cat.catCount}</div>
          </Link>
        </div>
      ));
    });
    return <div className="cats-wrap page-content">{catsHTML}</div>
  }

  render() {
    const { data = {}, location = {} } = this.props;

    const { site = {}, allMarkdownRemark = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;

    const { siteMetadata } = site;
    const { edges: cats } = allMarkdownRemark;
    const { edges: navs } = allNavigationJson;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    return (
      <Layout pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO
          title="All cats"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {this.getCatsHTML(dealWithCats(cats))}
      </Layout>
    )
  }
}


export default CatsPage

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
/**
将graphql查询的结果进行处理
原数据结果：
[
  {
    "node": {
      "frontmatter": {
        "category": "xxx"
      }
    }
  }
]
处理为：
[
  {
    "catValue": "xxx",
    "catLink": "xxx",
    "catCount": 1
  }
]
另外，进行一些边界处理
*/
function dealWithCats(arr) {
  // 将多个tag先拆分出来
  const result = [];
  let noCatCount = 0; // 统计没有cat的个数
  arr.forEach((item) => {
    const { category } = item.node.frontmatter;
    if (category) {
      const index = findIndex(result, (node) => (node.catValue === category));
        if (index >= 0) {
          result[index]['catCount']++;
        } else {
          result.push({
            catValue: category,
            catLink: kebabCase(category),
            catCount: 1,
          })
        }
    } else {
      noCatCount++;
    }
  });
  if (noCatCount > 0) {
    result.push({
      catValue: '未分类',
      catLink: 'uncat',
      catCount: noCatCount,
    });
  }
  return result;
}