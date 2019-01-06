module.exports = {
  pathPrefix: "/blog",
  siteMetadata: {
    title: 'LDC4',
    author: 'Weedust',
    description: '从零开始，斗破苍穹，七界传说',
    siteUrl: 'https://weedust.com/',
    social: {
      github: 'https://github.com/ldc4',
    },
  },
  plugins: [
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/config/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'blog',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/assets`,
        name: 'assets',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: `<!-- end -->`,
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        //trackingId: 'ADD YOUR TRACKING ID HERE',
      },
    },
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Gatsby Starter Blog',
        short_name: 'GatsbyJS',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'content/assets/ldc4.png',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-less',
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    }
  ],
}
