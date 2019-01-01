import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Logo = () => (
  <StaticQuery
    query={graphql`
      query LogoQuery {
        avatar: file(absolutePath: { regex: "/logo.jpg/" }) {
          childImageSharp {
            fixed(width: 50, height: 50) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `}
    render={data => <Image fixed={data.avatar.childImageSharp.fixed} />}
  />
)
export default Logo

