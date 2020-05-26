// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'joaovitoras Blog',
  siteDescription: 'Blog pessoal para coisas aleatórias que me da vontade de escrever',
  siteUrl: 'https://joaovitoras.github.io',
  templates: {
    Post: '/:title',
    Tag: '/tag/:id'
  },
  plugins: [
    {
      // Create posts from markdown files
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'Post',
        path: 'content/posts/*.md',
        refs: {
          // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
          tags: {
            typeName: 'Tag',
            create: true
          }
        },
      }
    },
    {
      use: '@gridsome/plugin-sitemap',
      options: {
        config: {
          '/': {
            changefreq: 'weekly',
            priority: 0.5
          },
          '/*': {
            changefreq: 'weekly',
            priority: 0.7
          }
        }
      }
    },
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-54266208-2'
      }
    }
  ],

  transformers: {
    //Add markdown support to all file-system sources
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        'gridsome-plugin-remark-codesandbox',
        '@gridsome/remark-prismjs',
      ],
    },
  },
}
