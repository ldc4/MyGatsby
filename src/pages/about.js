import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import SEO from '../components/SEO/seo'
import { Row, Col } from '../components/Grids'
import './about.less'

class About extends React.Component {
  render() {
    const { data = {}, location = {} } = this.props;

    const { site = {}, allNavigationJson = {} } = data;
    const { pathname = '' } = location;

    const { siteMetadata } = site;
    const { edges: navs = [] } = allNavigationJson;

    // 得到相对路径
    const reg = new RegExp(`^${__PATH_PREFIX__}`);
    const rePathname = pathname.replace(reg, '');

    return (
      <Layout type="one-screen" pathname={rePathname} metadata={siteMetadata} navs={navs}>
        <SEO
          title="All posts"
          keywords={[`about`, `gatsby`, `ldc4`, `weedust`]}
        />
        <div className="about">
          <div className="about-content">
            <Row>
              <Col span="16">
                <Row>
                  <Col span="2"></Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>代号</div>
                        </div>
                        <div className="box-content">
                          <div>中文名：赵青松</div>
                          <div>英文名：weedustzhao</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>基本信息</div>
                        </div>
                        <div className="box-content">
                          <div>年龄：25岁</div>
                          <div>性别：男</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>教育程度</div>
                        </div>
                        <div className="box-content">
                          <div>毕业学校：重庆邮电大学/本科</div>
                          <div>选修专业：计算机与智能科学大类/信息安全</div>
                          <div>学习路线：JAVA EE</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col span="2"></Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>职业</div>
                        </div>
                        <div className="box-content">
                          <div>岗位：web前端开发</div>
                          <div>自我定位：Web Developer</div>
                          <div>就职公司：Tencent</div>
                          <div>待过的部门：（SNG）社交网络运营部、（CSIG）云服务平台部、（WXG）微信支付线-研发部</div>
                          <div>目前坐标：深圳</div>
                          <div>目前方向：研发效率提升</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>兴趣</div>
                        </div>
                        <div className="box-content">
                          <div>编程（唯一作为工作的兴趣，JS天下无敌）</div>
                          <div>玩游戏（PC/PS/Switch，手残平民玩家）</div>
                          <div>浅度二次元（动漫、高达、公仔手办）</div>
                          <div>Poping（资质不行，已放弃）</div>
                          <div>Launchpad（种草中）</div>
                          <div>做游戏（Unity3D，精力不够已放弃。Cocos Creator，种草中）</div>
                          <div>赚钱（炒港股，为了能够更好的支撑我兴趣，目前唯一觉得可以一试的道路，目前赔本中，求大佬带带本韭）</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span="7">
                    <div className="box-wrap">
                      <div className="box">
                        <div className="box-title">
                          <div>其他</div>
                        </div>
                        <div className="box-content">
                          <div>性格：温和，脾气好，近熟者。偶有不理智无害行为。</div>
                          <div>擅长：环境适应能力强，能保持学习热情</div>
                          <div>缺点：创造能力弱，精力容易分散，专精度不够深，害怕演讲，英文白痴，沟通能力有待提升</div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            
          </div>
        </div>
      </Layout>
    )
  }
}

export default About

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author
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
